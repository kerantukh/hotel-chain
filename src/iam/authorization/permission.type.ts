// Импортируем перечисление "Разрешения на продукты" из соответствующего файла
import { ProductsPermission } from 'src/products/products.permission';

// Объявляем константу "Permission", которая содержит все значения перечисления "Разрешения на продукты"
// Используется оператор расширения "...", чтобы копировать значения перечисления в константу
export const Permission = {
  ...ProductsPermission,
};

// Объявляем тип "PermissionType", который будет использоваться для обозначения разрешений
// Тип "PermissionType" определяется как "ProductsPermission", что означает, что разрешения могут быть только теми, что определены в перечислении "Разрешения на продукты"
export type PermissionType = ProductsPermission;
