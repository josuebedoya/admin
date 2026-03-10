import Label from "@/components/form/Label"

type TextAreaProps = {
  name: string;
  label: string;
  placeholder: string;
  value: string | number;
  onChange: (name: string, value: string) => void;
}

const TextAreaField: React.FC<TextAreaProps> = ({name, label, placeholder, value, onChange}) => {
  return (
    <div className="w-full">
      <Label className="text-md">
        {label} <span className="text-error-500">*</span>{" "}
      </Label>
      <textarea
        name={name}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        defaultValue={value}
        className="h-24 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 min-h-24 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
      />
    </div>
  )
}

export default TextAreaField;
