import React from "react";
import { Button } from "@/components/ui/button";

interface CompareButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const CompareButton: React.FC<CompareButtonProps> = ({ onClick, disabled, className }) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      variant="default"
      size="lg"
    >
      Compare
    </Button>
  );
};

export default CompareButton;
