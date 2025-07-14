"""
Configuration Manager for Video Processing Workflow
Handles loading, validation, and access to configuration settings.
"""

import json
import os
from typing import Dict, Any
import logging

class ConfigManager:
    def __init__(self, config_path: str = "config.json"):
        """
        Initialize the configuration manager.
        
        Args:
            config_path: Path to the configuration file
        """
        self.config_path = config_path
        self.config = self._load_config()
        self._validate_config()
        

    def _load_config(self) -> Dict[str, Any]:
        """Load configuration from JSON file."""
        try:
            if not os.path.exists(self.config_path):
                raise FileNotFoundError(f"Configuration file not found: {self.config_path}")
                
            with open(self.config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
                
            print(f"✅ Configuration loaded from {self.config_path}")
            return config
            
        except Exception as e:
            print(f"❌ Error loading configuration: {e}")
            raise
            
    def _validate_config(self) -> None:
        """Validate critical configuration settings."""
        required_sections = ['general', 'ai', 'video', 'folders']
        
        for section in required_sections:
            if section not in self.config:
                raise ValueError(f"Missing required configuration section: {section}")
                
        # Validate folder paths
        folders = self.config['folders']
        for folder_name, folder_path in folders.items():
            if not os.path.exists(folder_path):
                if folder_name in ['input', 'output', 'assets', 'logs', 'temp']:
                    print(f"⚠️  Creating missing folder: {folder_path}")
                    os.makedirs(folder_path, exist_ok=True)
                    
        # Validate asset files if enabled
        if self.config['logo']['enabled']:
            logo_path = self.config['logo']['path']
            if not os.path.exists(logo_path):
                print(f"⚠️  Logo file not found: {logo_path}")
                print("   Add your logo as assets/logo.png or disable in config.json")
                
        if self.config['outro']['enabled']:
            outro_path = self.config['outro']['path']
            if not os.path.exists(outro_path):
                print(f"⚠️  Outro video not found: {outro_path}")
                print("   Add your outro as assets/outro.mp4 or disable in config.json")
                
    def get(self, section: str, key: str = None, default: Any = None) -> Any:
        """
        Get configuration value.
        
        Args:
            section: Configuration section name
            key: Optional key within section
            default: Default value if not found
            
        Returns:
            Configuration value or default
        """
        try:
            if section not in self.config:
                return default
                
            if key is None:
                return self.config[section]
                
            return self.config[section].get(key, default)
            
        except Exception:
            return default
            
    def update(self, section: str, key: str, value: Any) -> None:
        """
        Update configuration value.
        
        Args:
            section: Configuration section name
            key: Key within section
            value: New value
        """
        if section not in self.config:
            self.config[section] = {}
            
        self.config[section][key] = value
        
    def save(self) -> None:
        """Save current configuration to file."""
        try:
            with open(self.config_path, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, indent=2)
                
            print(f"✅ Configuration saved to {self.config_path}")
            
        except Exception as e:
            print(f"❌ Error saving configuration: {e}")
            raise
            
    def get_prompt(self, prompt_name: str = "analysis_prompt") -> str:
        """Get AI prompt from configuration."""
        return self.get('prompts', prompt_name, "")
        
    def get_folders(self) -> Dict[str, str]:
        """Get all folder paths."""
        return self.get('folders', default={})
        
    def is_auto_mode(self) -> bool:
        """Check if auto mode is enabled."""
        return self.get('general', 'auto_mode', True)
        
    def should_review_ai_output(self) -> bool:
        """Check if AI output review is enabled."""
        return self.get('general', 'review_ai_output', False)
        
    def should_delete_temp_files(self) -> bool:
        """Check if temporary files should be deleted."""
        return self.get('general', 'delete_temp_files', True)
        
    def get_supported_formats(self) -> list:
        """Get list of supported video formats."""
        return self.get('file_handling', 'supported_formats', ['.mp4', '.mov'])
        
    def __str__(self) -> str:
        """String representation of configuration."""
        return f"ConfigManager(path='{self.config_path}', sections={list(self.config.keys())})" 