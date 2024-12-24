'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface SkillSelectProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
}

export function SkillSelect({ selectedSkills, onSkillsChange }: SkillSelectProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!selectedSkills.includes(inputValue.trim())) {
        onSkillsChange([...selectedSkills, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="space-y-2">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a skill and press Enter (e.g., React, TypeScript)"
      />
      <div className="flex flex-wrap gap-2">
        {selectedSkills.map((skill) => (
          <Badge key={skill} variant="secondary" className="flex items-center gap-1">
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}