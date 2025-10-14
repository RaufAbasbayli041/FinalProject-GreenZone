import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  actions?: Array<{
    label: string;
    onClick: (item: T) => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'destructive';
  }>;
}

export function DataTable<T extends { id: number }>({
  data,
  columns,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
  actions = [],
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>{column.title}</TableHead>
              ))}
              {(onEdit || onDelete || onView || actions.length > 0) && (
                <TableHead className="w-[100px]">Действия</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                ))}
                {(onEdit || onDelete || onView || actions.length > 0) && (
                  <TableCell>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-8" />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>{column.title}</TableHead>
              ))}
              {(onEdit || onDelete || onView || actions.length > 0) && (
                <TableHead className="w-[100px]">Действия</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length + (onEdit || onDelete || onView || actions.length > 0 ? 1 : 0)} className="text-center py-8">
                <div className="text-gray-500">Нет данных для отображения</div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  const renderCellValue = (column: Column<T>, item: T) => {
    const value = typeof column.key === 'string' 
      ? (item as any)[column.key] 
      : item[column.key as keyof T];

    if (column.render) {
      return column.render(value, item);
    }

    return value;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={String(column.key)}
                style={{ width: column.width }}
              >
                {column.title}
              </TableHead>
            ))}
            {(onEdit || onDelete || onView || actions.length > 0) && (
              <TableHead className="w-[100px]">Действия</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {renderCellValue(column, item)}
                </TableCell>
              ))}
              {(onEdit || onDelete || onView || actions.length > 0) && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Просмотр
                        </DropdownMenuItem>
                      )}
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Редактировать
                        </DropdownMenuItem>
                      )}
                      {actions.map((action, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => action.onClick(item)}
                          className={action.variant === 'destructive' ? 'text-red-600' : ''}
                        >
                          {action.icon && <span className="mr-2">{action.icon}</span>}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(item)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Удалить
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
