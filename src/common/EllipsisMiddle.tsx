import React from "react";
import { Typography } from "antd";
import { TextProps } from "antd/lib/typography/Text";

const { Text } = Typography;

interface EllipsisMiddleProps extends TextProps {
  suffixCount: number;
  children: string;
}

const EllipsisMiddle = ({
  suffixCount,
  children,
  ...props
}: EllipsisMiddleProps) => {
  const start = children.slice(0, children.length - suffixCount).trim();
  const suffix = children.slice(-suffixCount).trim();
  return (
    <Text {...props} style={{ width: "50%" }} ellipsis={{ suffix }}>
      {start}
    </Text>
  );
};

export default EllipsisMiddle;
