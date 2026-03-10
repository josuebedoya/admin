import Label from "@/components/form/Label"
import Select from "../form/Select";
import { ChevronDownIcon } from "@/icons";

type FieldProps = {
  name: string;
  label: string;
  placeholder: string;
  value: string | number;
  onChange: (name: string, value: string) => void;
  options?: { value: string; label: string }[];
}

const SelectField: React.FC<FieldProps> = ({ ...field }) => {
  return (
    <div key={field.name} className="mb-5 lg:mb-8 w-full">
      <Label className="text-md">
        {field.label} <span className="text-error-500">*</span>{" "}
      </Label>
      <Select
        name={field.name}
        options={field.options || []}
        placeholder={field.placeholder}
        onChange={() => field.onChange(field.name, String(field.value))}
        className="!h-14"
        defaultValue={String(field.value)}
      />
      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
        <ChevronDownIcon />
      </span>
    </div>
  )
}

export default SelectField;
