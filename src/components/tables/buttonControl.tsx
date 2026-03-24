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
      {icon && <span className="min-md:mr-2">{icon}</span>}
      {<span className="max-md:hidden">{label}</span>}
    </Button>
  );
}

export default ButtonControl;