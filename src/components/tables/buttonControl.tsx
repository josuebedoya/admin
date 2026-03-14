import Button from "../ui/button/Button";

type ButtonControlProps = {
  label?: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

const ButtonControl = ({onClick, label, icon}: ButtonControlProps) => {
  return (
    <Button
      size='sm'
      variant='primary'
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Button>
  );
}

export default ButtonControl;