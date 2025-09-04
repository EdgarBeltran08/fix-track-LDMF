import { GluestackUIProvider, Table, Tbody, Td, Th, Thead, Tr } from '@gluestack-ui/core'; // Asegúrate de importar los componentes correctamente
import React, { useEffect, useState } from 'react';

const InventoryTable = ({ items }) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Nombre del Ítem</Th>
          <Th>SKU</Th>
          <Th>Categoría</Th>
          <Th>Stock</Th>
          <Th>Acciones</Th>
        </Tr>
      </Thead>
      <Tbody>
        {items.map((item) => (
          <Tr key={item.id}>
            <Td>{item.name}</Td>
            <Td>{item.sku}</Td>
            <Td>{item.category}</Td>
            <Td>{item.stock}</Td>
            <Td>
              <button onClick={() => handleLinkToRepair(item.id)}>Vincular a Repair</button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default function InventoryPage() {
  const [items, setItems] = useState([]);

  // Simulación de carga de datos de inventario
  useEffect(() => {
    setItems([
      { id: 1, name: 'Ítem A', sku: 'SKU123', category: 'Categoría 1', stock: 10 },
      { id: 2, name: 'Ítem B', sku: 'SKU124', category: 'Categoría 2', stock: 5 },
    ]);
  }, []);

  return (
    <GluestackUIProvider mode="system">
      <InventoryTable items={items} />
    </GluestackUIProvider>
  );
}
