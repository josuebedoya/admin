import Select from "../form/Select";
import Label from "../form/Label";
import Field from "./field";

type FieldType = {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  value: string | number;
  onChange: (name: string, value: string) => void;
  options?: { value: string | number; label: string }[];
}

type FieldGroupType = {
  group: FieldType[];
}

type RenderFieldsProps = {
  fields: (FieldType | FieldGroupType)[];
}

const RenderFields: React.FC<RenderFieldsProps> = ({ fields }) => {
  return (
    <>
      {fields.map((field, index) => {
        // Verificar si es un grupo
        if ('group' in field) {
          return (
            <div key={`group-${index}`} className="mb-5 lg:mb-8 flex flex-col lg:flex-row gap-4">
              {field.group.map((subField) => (
                subField.type === 'select' ? (
                  <div key={subField.name} className="w-full">
                    <Label className="text-md">
                      {subField.label} <span className="text-error-500">*</span>
                    </Label>
                    <Select
                      name={subField.name}
                      placeholder={subField.placeholder}
                      defaultValue={String(subField.value)}
                      onChange={(value) => subField.onChange(subField.name, value)}
                      options={(subField.options ?? []).map(opt => ({ value: String(opt.value), label: opt.label }))}
                      className="h-14!"
                    />
                  </div>
                ) : (
                  <Field
                    key={subField.name}
                    {...subField}
                  />
                )
              ))}
            </div>
          );
        }

        // Campo individual
        return field.type === 'select' ? (
          <div key={field.name} className="mb-5 lg:mb-8 w-full">
            <Label className="text-md">
              {field.label} <span className="text-error-500">*</span>
            </Label>
            <Select
              name={field.name}
              placeholder={field.placeholder}
              defaultValue={String(field.value)}
              onChange={(value) => field.onChange(field.name, value)}
              options={(field.options ?? []).map(opt => ({ value: String(opt.value), label: opt.label }))}
              className="h-14!"
            />
          </div>
        ) : (
          <Field
            key={field.name}
            {...field}
          />
        );
      })}
    </>
  )
}

export default RenderFields;