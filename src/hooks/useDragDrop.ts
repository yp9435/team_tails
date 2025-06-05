
import { useDragLayer } from 'react-dnd';
import type { Employee } from '../types/employee';

export function useDragDrop() {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  return {
    isDragging,
    draggedEmployee: item as Employee | null,
    dragOffset: currentOffset,
  };
}
