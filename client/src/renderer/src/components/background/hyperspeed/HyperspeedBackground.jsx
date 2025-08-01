import { Button, ColorPicker, Flex, Form, Radio, Select } from 'antd';
import { toggleBackgroundSettings } from '../../context/BackgroundSettingsContext';
import { hyperspeedPresets } from '../hyperspeedPresets/HyperspeedPresets';
import { useState } from 'react';

function HyperspeedBackground({setFormData, handleFormChange, formData, backgroundForm, setSelectedPreset}){

    const hyperspeedPresetOptions = [
        { value: 'Default', label: 'Default' },
        { value: 'cyberpunk', label: 'CyberPunk' },
        { value: 'akira', label: 'Akira' },
        { value: 'golden', label: 'Golden' },
        { value: 'split', label: 'Split' },
        { value: 'highway', label: 'Highway' },
        { value: 'other', label: 'other' },
    ]

    return (
        <>
            <div className="mt-[20px]">
                <Form.Item
                    name="preset"
                    label="preset"
                    initialValue={'Default'}
                >
                        <Select
                        style={{ width: 120 }}
                        onChange={(e) => setSelectedPreset(e)}
                        options={hyperspeedPresetOptions}
                        />
                </Form.Item>            
            </div>
        </>
    )
}

export default HyperspeedBackground;