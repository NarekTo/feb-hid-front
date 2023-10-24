"use client"

import { useEffect, useState, KeyboardEvent, FC } from "react";
import { useSession } from "next-auth/react";
import io from 'socket.io-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Session } from "../../types";


interface TableCrudProps<T> {
    tableItems: T[];
    batchNum: string;
    project: string;
  }

const TableCrud: FC<TableCrudProps<any>> = ({ tableItems, batchNum, project }) => {
  const searchParams = useSearchParams();
  const { data: session } = useSession() as { data: Session | null };
 
    const [items, setItems] = useState(tableItems);
    const router = useRouter();
    const job_id = searchParams.get('job_id') as string;

    const handleItemClick = (itemId: string) => {
      // Navigate to the item page
      const item = itemId.trim();
      const jobId = job_id.trim();
      router.push(`/items/batches/${batchNum}/${item}?job_id=${jobId}&project_name=${project.replace(/ /g, '_')}`);
    };

    const extractKeys = (arr: object[]) => {
        const allKeys = new Set();
        arr.forEach((obj) => {
          Object.keys(obj).forEach((key) => {
            allKeys.add(key);
          });
        });
        return Array.from(allKeys);
      };
    
    const keys = tableItems && extractKeys(tableItems);

    const handleKeyDown = async (event: KeyboardEvent, itemId: string, key: string) => {
        if (event.key === 'Tab') {
          event.preventDefault(); // Prevent the default action (moving to the next cell)
          const updatedValue = (event.target as HTMLElement).innerText;
          const updatedItems = items.map(item => {
            if (item.Item_id === itemId) {
              return { ...item, [key]: updatedValue };
            }
            return item;
          });
          setItems(updatedItems);
      
          // Call your API to update the item in the database
          const response = await fetch(`http://localhost:3000/items/${itemId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(updatedItems.find(item => item.Item_id === itemId)),
          });
          if (response.ok) {
            console.log('Item updated successfully');
          } else {
            console.log('Failed to update item');
          }
      
         // Move the focus to the next cell
const targetElement = event.target as HTMLElement;
const nextCell = targetElement.nextElementSibling;
if (nextCell instanceof HTMLElement) {
  nextCell.focus();
}
        }
      };

    useEffect(() => {
        const socket = io('ws://localhost:3002');

        socket.on('connect', () => {
          console.log('WebSocket connection opened');
        });
        
        socket.on('error', (error: Error | string) => {
            console.log('WebSocket error: ', error);
          });
        
          socket.on('itemUpdated', (updatedItem) => {
          // Handle the 'itemUpdated' event
          console.log('Received updated item: ', updatedItem);
          
          // Update the items state with the updated item
          setItems(prevItems => prevItems.map(item => 
            item.Item_id === updatedItem.Item_id ? updatedItem : item
          ));
        });
    
        // Close the WebSocket connection when the component unmounts
    return () => {
          socket.close();
        };
      }, []);

    
      return (
        <div className="h-full w-full overflow-y-auto bg-slate-100 p-2 rounded-md">
        <table className="min-w-full text-left text-sm font-light table-auto w-full">
        <thead  className="bg-dark-blue text-white sticky top-0 w-full rounded-md">
              <tr>
                {keys.map((key) => (
                  <th
      scope="col"
      className="px-2 py-1 font-medium tracking-wide whitespace-nowrap" // Add whitespace-nowrap here
      key={key as string}
    >
      {(key as string)
        .replace(/_/g, ' ') // Replace underscores with spaces
        .split(' ') // Split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' ') // Join the words back into a single string
      }
    </th>
                ))}
              </tr>
            </thead>
            <tbody className="max-h-full overflow-y-auto overflow-scroll w-full p-2">
  {items.map((item, index) => (
    <tr
      className="border-b dark:border-neutral-500 cursor-pointer"
      key={index}
    >
      {keys.map((key) => (
        <td
        key={key as string}
          contentEditable={key !== 'Item_id'}
          suppressContentEditableWarning
          onClick={key === 'Item_id' ? () => handleItemClick(item.Item_id) : undefined}
          onKeyDown={event => handleKeyDown(event, item.Item_id, key as string)}
          className={`px-2 py-1 font-normal ${key === 'Item_id' ? "text-blue-700" : ""}`}>

          {item[key as string]}
        </td>
      ))}
    </tr>
  ))}
</tbody>
          </table>
        </div>
      );
    };
  
  export default TableCrud;