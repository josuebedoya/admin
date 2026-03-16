import Label from "@/components/form/Label"
import Select from "../../form/Select";

type FieldProps = {
  name: string;
  label: string;
  placeholder: string;
  value: string | number | null;
  onChange: (name: string, value: string) => void;
  options?: { value: string | number; label: string }[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => Promise<{ value: string | number; label: string }[]>;
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
        onChange={(val) => field.onChange(field.name, String(val))}
        className="h-14!"
        defaultValue={String(field.value)}
        searchable={field.searchable ?? true}
        searchPlaceholder={field.searchPlaceholder}
        onSearch={field.onSearch}
      />
    </div>
  )
}

export default SelectField;
