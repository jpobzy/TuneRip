import { Button, ColorPicker, Flex, Form, Radio, Slider, Spin } from 'antd';
import { useClickToggle } from '../../context/CursorContext';

function SplashCursorFormItems({}){
    const {reset, splashCursorSettings} = useClickToggle();

    return (
        <>
            <div className="mt-[20px]">
                <Form.Item 
                    style={{width: 300 }}
                    name="splatRadius"
                    initialValue={splashCursorSettings.splashCursorCursorSettings.SPLAT_RADIUS} 
                    label={'Splat Radius'}>
                    <Slider 
                    min={splashCursorSettings.splashCursorFormSettings.SPLAT_RADIUS.min}
                    max={splashCursorSettings.splashCursorFormSettings.SPLAT_RADIUS.max}
                    step={splashCursorSettings.splashCursorFormSettings.SPLAT_RADIUS.step} 
                    />
                </Form.Item> 
        
                <Form.Item 
                    style={{width: 300 }}
                    name="splatForce"
                    initialValue={splashCursorSettings.splashCursorCursorSettings.SPLAT_FORCE} 
                    label={'Splat Force'}>
                    <Slider 
                    min={splashCursorSettings.splashCursorFormSettings.SPLAT_FORCE.min}
                    max={splashCursorSettings.splashCursorFormSettings.SPLAT_FORCE.max}
                    step={splashCursorSettings.splashCursorFormSettings.SPLAT_FORCE.step} 
                    />
                </Form.Item> 
            </div>        
        </>
    )
}

export default SplashCursorFormItems;