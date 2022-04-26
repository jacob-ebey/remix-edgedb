import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
export type $TaskλShape = $.typeutil.flatten<_std.$Object_f1e1d4a0bda611eca08599c7be50f4a1λShape & {
  "completed": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, true>;
  "text": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "owner": $.LinkDesc<$User, $.Cardinality.One, {}, false, false,  false, false>;
  "createdAt": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, false, true>;
}>;
type $Task = $.ObjectType<"default::Task", $TaskλShape, null>;
const $Task = $.makeType<$Task>(_.spec, "7d10623a-c518-11ec-9f25-35825050c5c2", _.syntax.literal);

const Task: $.$expr_PathNode<$.TypeSet<$Task, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Task, $.Cardinality.Many), null, true);

export type $UserλShape = $.typeutil.flatten<_std.$Object_f1e1d4a0bda611eca08599c7be50f4a1λShape & {
  "password": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "username": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "<owner[is Task]": $.LinkDesc<$Task, $.Cardinality.Many, {}, false, false,  false, false>;
  "<owner": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $User = $.ObjectType<"default::User", $UserλShape, null>;
const $User = $.makeType<$User>(_.spec, "7d0bbe1a-c518-11ec-b89b-ab020539cfca", _.syntax.literal);

const User: $.$expr_PathNode<$.TypeSet<$User, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($User, $.Cardinality.Many), null, true);



export { $Task, Task, $User, User };

type __defaultExports = {
  "Task": typeof Task;
  "User": typeof User
};
const __defaultExports: __defaultExports = {
  "Task": Task,
  "User": User
};
export default __defaultExports;
