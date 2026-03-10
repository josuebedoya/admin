import Select from "@/components/form/Select";

type SelectSizeProps = {
  onChangeSelect: (value: string) => void;
  total: number;
};

const SelectSize: React.FC<SelectSizeProps> = ({ onChangeSelect, total }) => {
  const options = [
    { value: "5", label: "5" },
    { value: "10", label: "10", selected: true },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
    { value: "200", label: "200" },
  ];

  return (
    <div className="flex items-center">
      <span className="mr-2 text-sm text-gray-700">Mostrando:</span>
      <div className="relative">
        <Select
          name="pageSize"
          options={options}
          onChange={onChangeSelect}
          className="dark:bg-dark-900 !w-20 !px-2"
          defaultValue="10"
        />
      </div>
      <span className="ml-2 text-sm text-gray-700">
        <strong className="text-lg">{' '}/ {total} {''}</strong> Elementos
      </span>
    </div>
  );
};

export default SelectSize;
