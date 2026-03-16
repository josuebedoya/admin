import Delete, {ResDelete} from "@/server/services/delete";

type Params = {
  table: string;
  eq: { [key: string]: string | number | boolean | string[] | number[] | boolean[] };
}

const deleteBy = async ({table, ...query}: Params): Promise<ResDelete> => {

  const {data, error, success, message} = await Delete({
    table,
    ...query
  });

  return {data, error, success, message};
}

export default deleteBy;