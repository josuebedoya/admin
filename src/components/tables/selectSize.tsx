import Select from "@/components/form/Select";

type SelectSizeProps = {
  onChangeSelect: (value: string | number) => void;
  total: number;
};

const SelectSize: React.FC<SelectSizeProps> = ({onChangeSelect, total}) => {
  const options = [
    {value: "5", label: "5"},
    {value: "10", label: "10", selected: true},
    {value: "20", label: "20"},
    {value: "50", label: "50"},
    {value: "100", label: "100"},
    {value: "200", label: "200"},
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-[14px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
        Mostrar
      </span>
      <Select
        name="pageSize"
        options={options}
        onChange={onChangeSelect}
        className="dark:bg-dark-900 w-[72px]! h-8! px-2! py-0! text-xs!"
        defaultValue="10"
        searchable={false}
        searchPlaceholder="Buscar tamaño..."
      />
      <span className="text-[14px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
        de{" "}
        <span className="font-semibold text-gray-700 dark:text-gray-200">
          {total}
        </span>{" "}
        registros
      </span>
    </div>
  );
};

export default SelectSize;
