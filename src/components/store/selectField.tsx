import Label from "@/components/form/Label"
import Select from "../form/Select";

type FieldProps = {
  name: string;
  label: string;
  placeholder: string;
  value: string | number;
  onChange: (name: string, value: string) => void;
  options?: { value: string | number; label: string }[];
}

const SelectField: React.FC<FieldProps> = ({...field}) => {
  return (
    <div key={field.name} className="mb-5 lg:mb-8 w-full">
      <Label className="text-md">
        {field.label} <span className="text-error-500">*</span>
      </Label>
      <Select
        name={field.name}
        options={field.options || []}
        placeholder={field.placeholder}
        onChange={() => field.onChange(field.name, String(field.value))}
        className="!h-14"
        defaultValue={String(field.value)}
      />
    </div>
  )
}

export default SelectField;
