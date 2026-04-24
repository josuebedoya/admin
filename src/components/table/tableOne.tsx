import React from 'react';
import {Cell, Table, TBody, THead, TRow} from '@ui/table';
import {ArrowUpDown} from 'lucide-react';
import Controls from "@/components/table/components/controls";

const heads = ['ID', 'Nombre', 'Categoría', 'Stock', 'Precio'];

type Row = {
  id: number;
  nombre: string;
  cantidad: string;
  precio: number;
  categoria: string;
  isLast?: boolean;
}

const body = [
  {id: 1051, nombre: 'Jugo del valle 2.5', categoria: 'Gaseosa', cantidad: '5 und', precio: 6000},
  {id: 1049, nombre: 'Costilla ahumada', categoria: 'Cárnicos', cantidad: '8.25 kg', precio: 23000},
  {id: 1048, nombre: 'Chorizo casero', categoria: 'Cárnicos', cantidad: '2.75 kg', precio: 16000},
] as Row[];

const TableOne = () => {
  return (
    <div className="bg-gray-50/50 p-8 min-h-screen w-full">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <Table className="w-full border-collapse">

          {/*Heads Table*/}
          <THead className="bg-gray-50/80">
            <TRow className='group/head'>
              {heads?.map((head, index) => (
                <Cell
                  key={index}
                  isHead
                  className="px-6 py-3 text-gray-600 uppercase tracking-[1px] font-medium border-b border-gray-100 text-left"
                >
                <span className="inline-grid grid-flow-col items-center gap-2">
                  <small className='cursor-pointer text-xs '>{head}</small>
                  <ArrowUpDown
                    className="w-[14px] h-[14px] opacity-0 group-hover/head:opacity-100 transition duration-500 text-primary cursor-pointer"/>
                </span>
                </Cell>
              ))}
            </TRow>
          </THead>

          {/*Body Items Table*/}
          <TBody>
            {body?.map((row, rowIndex) => {
              const arr = Object.values(row) ?? [];
              return (
                <TRow
                  key={rowIndex}
                  className="group/row cursor-pointer rounded-md hover:bg-gray-100 transition duration-500"
                >
                  {arr?.map((cell, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      className="py-4 px-6 border-b border-gray-200 group-last/row:border-b-0 font-normal"
                    >
                        <span
                          className='flex items-center justify-between'>
                          <small
                            className='group-hover/row:text-primary transition duration-150 text-sm text-parragraph tracking-tighter'>
                            {cell}
                          </small>
                          {cellIndex === (arr?.length - 1) && <Controls/>}
                        </span>
                    </Cell>
                  ))}
                </TRow>
              )
            })}
          </TBody>
        </Table>
      </div>
    </div>
  );
};

export default TableOne;

