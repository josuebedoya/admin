import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";

type SelectSizeProps = {
  onChangeSelect: (value: string) => void;
};

const SelectSize: React.FC<SelectSizeProps> = ({ onChangeSelect }) => {
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
      <span className="mr-2 text-sm text-gray-700:">Mostrando:</span>
      <div className="relative">
        <Select
          options={options}
          onChange={onChangeSelect}
          className="dark:bg-dark-900 !w-20 !pl-2 !pr-8"
          defaultValue="10"
        />
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  );
};

export default SelectSize;
