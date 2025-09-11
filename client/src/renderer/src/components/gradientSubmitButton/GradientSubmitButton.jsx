import React from 'react';
import { AntDesignOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Space } from 'antd';
import { createStyles } from 'antd-style';

import { useTourContext } from 'components/context/SettingsTourContext';

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));
const GradientSubmitButton = ({callbackFunction, buttonDisabled}) => {
  const { styles } = useStyle();
  const {submitPlaylistsRef} = useTourContext();
  return (
    <div className='inline-block' ref={submitPlaylistsRef}>
      <ConfigProvider
        button={{
          className: styles.linearGradientButton,
        }}
      >
        <Space>
          <Button type="primary" size="" loading={buttonDisabled} icon={<AntDesignOutlined />}  onClick={() => callbackFunction()}>
            Submit
          </Button>

        </Space>
      </ConfigProvider>      
    </div>

  );
};
export default GradientSubmitButton;