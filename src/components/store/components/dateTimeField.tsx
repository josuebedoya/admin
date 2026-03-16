import Label from "@/components/form/Label"
import DatePicker from "@/components/form/date-picker";

type FieldProps = {
  name: string;
  label: string;
  placeholder: string;
  value: string | number | null;
  onChange: (name: string, date: string) => void;
}

const DateTimeField: React.FC<FieldProps> = ({...field}) => {
  return (
    <div key={field.name} className="mb-5 lg:mb-8 w-full">
      <Label className="text-md">
        {field.label} <span className="text-error-500">*</span>
      </Label>
      <DatePicker
        id={field.name}
        placeholder={field.placeholder}
        defaultDate={String(field.value)}
        className="!h-14 w-full"
        onChange={(_, date) => {
          field.onChange(field.name, date)
        }}
      />
    </div>
  )
}

export default DateTimeField;
