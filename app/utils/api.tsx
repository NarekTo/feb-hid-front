import { ProjectItemsWithSelect, Session, ProjectItemImages } from "../types";

//----------------------------------- ITEMSTABLE FETCHING

// ADD ROW
export const addRow = async (
  newRow: ProjectItemsWithSelect,
  session: Session | null
) => {
  const { select, ...restOfNewRow } = newRow;

  try {
    const response = await fetch(`http://localhost:3000/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(restOfNewRow),
    });

    if (response.ok) {
      console.log("Row added successfully");
    } else {
      console.error("Failed to add row");
    }
  } catch (error) {
    console.error("Error adding row:", error);
  }
};

// FETCH IMAGE
export const fetchItemImage = async (itemId: ProjectItemImages, session: Session | null) => {
  if (!session) {
    console.error("Session not available");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/images/${itemId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (response.ok) {
      const imageData = await response.json();
      console.log("Image data fetched successfully");
      return imageData;
    } else {
      console.error("Failed to fetch image data");
    }
  } catch (error) {
    console.error("Error fetching image data:", error);
  }
};

// GET INFO FOR NEW ROW
export const fetchRowData = async (
  id: number,
  batchNumber: string,
  session: Session | null
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/items/tabledata/${id}/${batchNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const { project, batch, items } = data;
      // Now you can use project, batch, and items
      return { project, batch, items };
    } else {
      console.error("Failed to fetch table data");
    }
  } catch (error) {
    console.error("Error fetching table data:", error);
  }
};

// DELETE ROW
export const changeRowStatus = async (
  itemId: string,
  status: string,
  session: Session
) => {
  console.log("Session token:", session.accessToken); // Log the session token

  try {
    // Send a PUT request to your backend to update the status of the item
    const response = await fetch(`http://localhost:3000/items/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ item_status: status }), // Update the item_status field with the new status
    });

    if (response.ok) {
      console.log("Item status updated successfully");
    } else {
      console.error("Failed to update item status");
    }
  } catch (error) {
    // Handle error if the update fails
    console.error("Error updating item status:", error);
  }
};

// UPDATE ROW
export const updateRow = async (
  itemId: string, // Assuming itemId is a string
  value: Record<string, unknown>, // Assuming value is an object with string keys and values of any type
  session: Session
): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:3000/items/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(value),
    });

    if (response.ok) {
      console.log("Item updated successfully");
      return true;
    } else {
      console.error("Failed to update item");
      return false;
    }
  } catch (error) {
    console.error("Error updating data:", error);
    return false;
  }
};

//----------------------------------- PROJECTS FETCHING

export const fetchItemDetails = async (
  itemId: string,
  session: Session | null
) => {
  if (!session) {
    console.error("Session not available");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/items/info/${itemId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (response.ok) {
      const itemDetails = await response.json();
      console.log("Item details fetched successfully");
      return itemDetails;
    } else {
      console.error("Failed to fetch item details");
    }
  } catch (error) {
    console.error("Error fetching item details:", error);
  }
};

//UPDATE PROJECT TABLES COMPOSITIONS, DIMENSIONS, SPECIFICATIONS, IMAGES, LOCATIONS
export const updateItemsDetails = async (
  type: string,
  itemId: string,
  value: Record<string, unknown>,
  action: string,
  session: Session
): Promise<boolean> => {
  try {
    console.log("id", itemId);
    const response = await fetch(
      `http://localhost:3000/items/${type}/${itemId.trim()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ ...value, action }),
      }
    );

    if (response.ok) {
      console.log("Item updated successfully");
      return true;
    } else {
      console.error("Failed to update item");
      return false;
    }
  } catch (error) {
    console.error("Error updating data:", error);
    return false;
  }
};
