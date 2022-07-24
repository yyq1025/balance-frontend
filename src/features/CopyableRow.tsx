import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import copy from "clipboard-copy";
import React, { useState } from "react";

interface CopyableRowProps {
  label: string;
  value: string;
}

function CopyableRow({ label, value }: CopyableRowProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    copy(value).then(() => {
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Box display="flex">
      <TextField
        label={label}
        value={value}
        variant="outlined"
        inputProps={{
          readOnly: true,
          style: { fontSize: "small", textOverflow: "ellipsis" },
        }}
        fullWidth
        size="small"
      />
      <Tooltip title={copied ? "Copied" : "Copy"} sx={{ ml: 1 }}>
        <IconButton onClick={handleCopy}>
          {copied ? (
            <DoneIcon fontSize="small" color="primary" />
          ) : (
            <ContentCopyIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default CopyableRow;
