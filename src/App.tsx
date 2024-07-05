import { useState } from 'react';

import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';

function Draggable(props: { name: string; row: number; col: number; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable_${props.row}_${props.col}`,
    data: {
      name: props.name,
      row: props.row,
      col: props.col,
    },
  });

  const style: { color: string; transform?: string } = {
    color: props.name[0] == 'R' ? 'red' : 'black',
  };

  if (transform) {
    style['transform'] = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
  }

  // const style = transform
  //   ? {
  //       transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  //     }
  //   : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}

function DroppableCell(props: { name: string; row: number; col: number; children: React.ReactNode }) {
  const { active, isOver, setNodeRef } = useDroppable({
    id: `droppable_${props.row}_${props.col}`,
    data: {
      name: props.name,
      row: props.row,
      col: props.col,
    },
  });

  const sameSide = active && active.data.current?.name[0] == props.name[0];

  const style = {
    background: isOver ? (sameSide ? 'red' : 'green') : undefined,
  };

  return (
    <td style={{ border: '1px solid black', padding: '10px', ...style }}>
      <div ref={setNodeRef}>{props.children}</div>
    </td>
  );
}

function App() {
  const [eventInfo, setEventInfo] = useState('<>');

  const [board, setBoard] = useState([
    ['BG', 'BG', 'BC', 'BC', 'BN', 'BN', 'BR', 'BR'],
    ['BG', 'BG', 'BC', 'BC', 'BN', 'BN', 'BB', 'BB'],
    ['RG', 'RG', 'RC', 'RC', 'RN', 'RN', 'RR', 'RR'],
    ['RG', 'RG', 'RC', 'RC', 'RN', 'RN', 'RR', 'RB'],
  ]);

  function handleDragEnd(event: DragEndEvent) {
    let activeEvent = event.active;
    let overEvent = event.over;

    if (!activeEvent?.data?.current || !overEvent?.data?.current) {
      return;
    }

    let activeData: any = activeEvent.data.current;
    let overData: any = overEvent.data.current;

    if (activeData.row == overData.row && activeData.col == overData.col) {
      // moving to same place
      setEventInfo('<>');
      return;
    }

    if (activeData.name[0] == overData.name[0]) {
      setEventInfo('same side');
      return;
    }

    setEventInfo(`${String(event?.active?.id) ?? ''} -> ${String(event?.over?.id) ?? ''}`);
    board[activeData.row][activeData.col] = '.';

    if (overData) {
      board[overData.row][overData.col] = activeData.name;
    }
  }

  return (
    <>
      {eventInfo}
      <DndContext onDragEnd={handleDragEnd}>
        <table>
          <tbody>
            {board.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  // let cellItem =
                  //   cell == '.' ? (
                  //     <div>{cell}</div>
                  //   ) : (
                  //     <Draggable name={cell} row={rowIndex} col={cellIndex}>
                  //       {cell}
                  //     </Draggable>
                  //   );
                  return (
                    <DroppableCell key={cellIndex} name={cell} row={rowIndex} col={cellIndex}>
                      {cell == '.' ? (
                        <div>{cell}</div>
                      ) : (
                        <Draggable name={cell} row={rowIndex} col={cellIndex}>
                          {cell}
                        </Draggable>
                      )}
                    </DroppableCell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </DndContext>
    </>
  );
}

export default App;
