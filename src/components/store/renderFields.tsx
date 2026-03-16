import Field from "./components/field";
import SelectField from "@/components/store/components/selectField";
import TextAreaField from "@/components/store/components/textAreaField";
import DateTimeField from "@/components/store/components/dateTimeField";

export type FieldType = {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  value: string | number | null;
  onChange: (name: string, value: string) => void;
  options?: { value: string | number; label: string }[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => Promise<{ value: string | number; label: string }[]>;
}

export type FieldGroupType = {
  group: FieldType[];
}

type RenderFieldsProps = {
  fields: (FieldType | FieldGroupType)[];
}

const ComponentField = (field: FieldType) => {
  switch (field.type) {
    case 'select':
      return (
        <SelectField
          key={field.name}
          {...field}
        />
      );
    case  'textarea':
      return (
        <TextAreaField
          key={field.name}
          {...field}
        />
      )
    case 'datetime':
      return (
        <DateTimeField
          key={field.name}
          {...field}
        />
      )
    default:
      return (
        <Field
          key={field.name}
          {...field}
        />
      );
  }
}

const RenderFields: React.FC<RenderFieldsProps> = ({fields}) => {
  return fields.map((field, index) => {
      if ('group' in field) {
        return (
          <div key={`group-${index}`} className="mb-5 lg:mb-8 flex flex-col lg:flex-row gap-4">
            {field.group.map((subField) => (
              <ComponentField key={subField.name} {...subField} />
            ))}
          </div>
        );
      }

      return <ComponentField key={field.name} {...field} />;
    }
  )
}

export default RenderFields;