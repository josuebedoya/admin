import Label from "@/components/form/Label"
import Input from "@/components/form/input/InputField";

type FieldProps = {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  value: string | number | null;
  onChange: (name: string, value: string) => void;
  step?: number;
}

const Field: React.FC<FieldProps> = ({name, label, placeholder, type, value, onChange, step}) => {
  return (
    <div className="w-full">
      <Label className="text-md">
        {label} <span className="text-error-500">*</span>{" "}
      </Label>
      <Input
        name={name}
        placeholder={placeholder}
        type={type}
        onChange={(e) => onChange(name, e.target.value)}
        defaultValue={value || ''}
        step={step}
        className="!h-14"
      />
    </div>
  )
}

export default Field;
