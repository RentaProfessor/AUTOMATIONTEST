"""
LLM Analyzer Module for Video Processing Workflow
Handles communication with local LLM (Ollama) for transcript analysis and overlay generation.
"""

import json
import requests
from typing import Dict, List, Any, Optional
import re
from pathlib import Path
import time
import os

class LLMAnalyzer:
    def __init__(self, config_manager):
        """
        Initialize the LLM analyzer.
        
        Args:
            config_manager: Configuration manager instance
        """
        self.config = config_manager
        self.ollama_url = self.config.get('ai', 'ollama_url', 'http://localhost:11434')
        self.model = self.config.get('ai', 'model', 'llama3:8b')
        self.temperature = self.config.get('ai', 'temperature', 0.7)
        self.max_tokens = self.config.get('ai', 'max_tokens', 1000)
        
        # Test connection to Ollama
        self._test_connection()
        
    def _test_connection(self) -> None:
        """Test connection to Ollama service."""
        try:
            response = requests.get(f"{self.ollama_url}/api/tags", timeout=5)
            if response.status_code == 200:
                models = response.json().get('models', [])
                model_names = [model['name'] for model in models]
                
                if self.model in model_names:
                    print(f"✅ Connected to Ollama - Model '{self.model}' available")
                else:
                    print(f"⚠️  Model '{self.model}' not found. Available models: {model_names}")
                    print(f"   Run: ollama pull {self.model}")
            else:
                raise ConnectionError(f"Ollama API returned status {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Cannot connect to Ollama at {self.ollama_url}")
            print(f"   Error: {e}")
            print(f"   Make sure Ollama is running: ollama serve")
            raise
            
    def _call_ollama(self, prompt: str) -> str:
        """
        Make API call to Ollama.
        
        Args:
            prompt: The prompt to send to the model
            
        Returns:
            Model response text
        """
        try:
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": self.temperature,
                    "num_predict": self.max_tokens
                }
            }
            
            print(f"🔄 Sending transcript to {self.model} for analysis...")
            start_time = time.time()
            
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json=payload,
                timeout=120  # 2 minute timeout for LLM processing
            )
            
            if response.status_code == 200:
                result = response.json()
                response_text = result.get('response', '').strip()
                
                duration = time.time() - start_time
                print(f"✅ LLM analysis completed in {duration:.1f} seconds")
                
                return response_text
            else:
                raise Exception(f"Ollama API error: {response.status_code} - {response.text}")
                
        except requests.exceptions.Timeout:
            print(f"❌ LLM request timed out after 2 minutes")
            raise
        except Exception as e:
            print(f"❌ Error calling Ollama: {e}")
            raise
            
    def _extract_json_from_response(self, response: str) -> Dict[str, Any]:
        """
        Extract JSON from LLM response, handling potential markdown formatting.
        
        Args:
            response: Raw LLM response
            
        Returns:
            Parsed JSON dictionary
        """
        try:
            # Try direct JSON parsing first
            return json.loads(response)
        except json.JSONDecodeError:
            pass
            
        # Look for JSON in markdown code blocks
        json_patterns = [
            r'```json\s*({.*?})\s*```',
            r'```\s*({.*?})\s*```',
            r'({.*?})',
        ]
        
        for pattern in json_patterns:
            matches = re.findall(pattern, response, re.DOTALL)
            for match in matches:
                try:
                    return json.loads(match)
                except json.JSONDecodeError:
                    continue
                    
        # If no valid JSON found, create a basic response
        print("⚠️  Could not extract valid JSON from LLM response")
        print(f"Raw response: {response[:200]}...")
        
        return {
            "overlays": [
                {
                    "timestamp": 5.0,
                    "text": "💰 Financial tip!",
                    "duration": 3.0
                }
            ]
        }
        
    def _validate_overlay_data(self, overlay_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate and clean overlay data from LLM.
        
        Args:
            overlay_data: Raw overlay data from LLM
            
        Returns:
            Validated and cleaned overlay data
        """
        if 'overlays' not in overlay_data:
            overlay_data = {'overlays': []}
            
        validated_overlays = []
        
        for overlay in overlay_data.get('overlays', []):
            # Validate required fields
            if not isinstance(overlay, dict):
                continue
                
            timestamp = overlay.get('timestamp', 0)
            text = overlay.get('text', '')
            duration = overlay.get('duration', 3.0)
            
            # Validate timestamp
            if not isinstance(timestamp, (int, float)) or timestamp < 0:
                continue
                
            # Validate text
            if not isinstance(text, str) or len(text.strip()) == 0:
                continue
                
            # Limit text length
            if len(text) > 100:
                text = text[:97] + '...'
                
            # Validate duration
            if not isinstance(duration, (int, float)) or duration <= 0:
                duration = 3.0
                
            validated_overlays.append({
                'timestamp': float(timestamp),
                'text': text.strip(),
                'duration': float(duration)
            })
            
        # Sort by timestamp
        validated_overlays.sort(key=lambda x: x['timestamp'])
        
        return {'overlays': validated_overlays}
        
    def analyze_transcript(self, transcript: str, video_path: str) -> Dict[str, Any]:
        """
        Analyze video transcript and generate overlay instructions.
        
        Args:
            transcript: Video transcript text
            video_path: Path to original video file
            
        Returns:
            Dictionary with overlay instructions
        """
        try:
            print(f"\n🤖 Analyzing transcript for overlay generation...")
            
            # Get analysis prompt from config
            base_prompt = self.config.get_prompt('analysis_prompt')
            
            # Construct full prompt
            full_prompt = f"{base_prompt}\n\n{transcript}"
            
            # Call LLM
            response = self._call_ollama(full_prompt)
            
            # Extract and validate JSON
            overlay_data = self._extract_json_from_response(response)
            validated_data = self._validate_overlay_data(overlay_data)
            
            # Log results
            overlay_count = len(validated_data['overlays'])
            print(f"✅ Generated {overlay_count} overlay instructions")
            
            for i, overlay in enumerate(validated_data['overlays'][:3]):  # Show first 3
                print(f"   {i+1}. {overlay['timestamp']}s: \"{overlay['text']}\"")
            
            if overlay_count > 3:
                print(f"   ... and {overlay_count - 3} more")
                
            return validated_data
            
        except Exception as e:
            print(f"❌ Error analyzing transcript: {e}")
            # Return fallback overlay
            return {
                "overlays": [
                    {
                        "timestamp": 3.0,
                        "text": "💰 Watch for tips!",
                        "duration": 3.0
                    }
                ]
            }
            
    def save_overlay_instructions(self, overlay_data: Dict[str, Any], video_path: str) -> str:
        """
        Save overlay instructions to JSON file.
        
        Args:
            overlay_data: Overlay instructions
            video_path: Original video path
            
        Returns:
            Path to saved JSON file
        """
        try:
            video_name = Path(video_path).stem
            temp_dir = self.config.get('folders', 'temp', 'temp')
            json_path = os.path.join(temp_dir, f"{video_name}_overlays.json")
            
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(overlay_data, f, indent=2, ensure_ascii=False)
                
            print(f"✅ Overlay instructions saved to {os.path.basename(json_path)}")
            return json_path
            
        except Exception as e:
            print(f"❌ Error saving overlay instructions: {e}")
            raise
            
    def generate_caption(self, transcript: str, video_path: str) -> str:
        """
        Generate a professional caption for the video based on its content.
        
        Args:
            transcript: Video transcript text
            video_path: Path to original video file
            
        Returns:
            Generated caption text
        """
        try:
            print(f"\n✍️  Generating caption for video content...")
            
            # Get caption prompt from config
            caption_prompt = self.config.get_prompt('caption_prompt')
            
            # Construct full prompt
            full_prompt = f"{caption_prompt}\n\n{transcript}"
            
            # Call LLM
            response = self._call_ollama(full_prompt)
            
            # Clean up the response
            caption = response.strip()
            
            # Remove any JSON formatting if present
            if caption.startswith('{') and caption.endswith('}'):
                try:
                    caption_data = json.loads(caption)
                    caption = caption_data.get('caption', caption)
                except json.JSONDecodeError:
                    pass
            
            # Remove markdown formatting
            caption = caption.replace('**', '').replace('*', '')
            
            # Ensure reasonable length (Instagram allows ~2200 characters)
            if len(caption) > 2200:
                caption = caption[:2197] + '...'
            
            print(f"✅ Generated caption ({len(caption)} characters)")
            print(f"📝 Preview: {caption[:100]}...")
            
            return caption
            
        except Exception as e:
            print(f"❌ Error generating caption: {e}")
            # Return fallback caption
            return """💰 Ready to take control of your finances? 

This video shows exactly the kind of financial insights we help our clients master every day. 

At Future Clarity Financial Evaluations, we don't just give generic advice - we provide personalized, professional financial guidance tailored to YOUR unique situation.

✨ What we offer:
• One-on-one sessions with experienced agents
• Comprehensive financial analysis
• Actionable plans with clear next steps
• Debt management strategies
• Budget creation & optimization
• Savings planning & goal setting

Ready to transform your financial future? Book your FREE consultation today!

💬 DM us 'CONSULTATION' to get started
🔗 Link in bio for instant booking

#FinancialAdvice #MoneyTips #BudgetingTips #DebtFree #FinancialPlanning #PersonalFinance #MoneyManagement #FinancialConsultation"""

    def save_caption(self, caption: str, video_path: str) -> str:
        """
        Save generated caption to text file.
        
        Args:
            caption: Generated caption text
            video_path: Original video path
            
        Returns:
            Path to saved caption file
        """
        try:
            video_name = Path(video_path).stem
            
            # Create captions directory if it doesn't exist
            captions_dir = 'captions'
            os.makedirs(captions_dir, exist_ok=True)
            
            caption_path = os.path.join(captions_dir, f"{video_name}_caption.txt")
            
            with open(caption_path, 'w', encoding='utf-8') as f:
                f.write(caption)
                
            print(f"✅ Caption saved to {os.path.basename(caption_path)}")
            return caption_path
            
        except Exception as e:
            print(f"❌ Error saving caption: {e}")
            raise

    def review_overlays(self, overlay_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Interactive review of overlay instructions (if enabled in config).
        
        Args:
            overlay_data: Generated overlay data
            
        Returns:
            Possibly modified overlay data
        """
        if not self.config.should_review_ai_output():
            return overlay_data
            
        print(f"\n📋 Review Overlay Instructions:")
        print(f"Found {len(overlay_data['overlays'])} overlays:")
        
        for i, overlay in enumerate(overlay_data['overlays']):
            print(f"  {i+1}. {overlay['timestamp']}s - \"{overlay['text']}\" ({overlay['duration']}s)")
            
        while True:
            choice = input("\nOptions: (a)ccept, (e)dit, (r)egenerate, (s)kip overlays: ").lower()
            
            if choice == 'a':
                return overlay_data
            elif choice == 's':
                return {'overlays': []}
            elif choice == 'e':
                # Simple edit interface
                try:
                    idx = int(input("Edit overlay number: ")) - 1
                    if 0 <= idx < len(overlay_data['overlays']):
                        new_text = input(f"New text (current: \"{overlay_data['overlays'][idx]['text']}\"): ")
                        if new_text.strip():
                            overlay_data['overlays'][idx]['text'] = new_text.strip()
                            print("✅ Overlay updated")
                        continue
                    else:
                        print("Invalid overlay number")
                        continue
                except ValueError:
                    print("Invalid input")
                    continue
            elif choice == 'r':
                print("Regeneration not implemented in this version")
                continue
            else:
                print("Invalid choice")
                continue
                
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the current model."""
        try:
            response = requests.get(f"{self.ollama_url}/api/show", 
                                  json={"name": self.model}, timeout=5)
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"Status {response.status_code}"}
        except Exception as e:
            return {"error": str(e)}
            
    def __str__(self) -> str:
        """String representation of the analyzer."""
        return f"LLMAnalyzer(model='{self.model}', url='{self.ollama_url}')" 