"use client";
import React, { useEffect, useState, useRef } from "react";
import Tree from "./components/tree";

const createTree = (data) => {
  const nodes = {};
  data.forEach((item) => {
    nodes[item.uuid] = { ...item, children: [] };
  });

  const tree = [];
  data.forEach((item) => {
    if (item.parent_id) {
      nodes[item.parent_id].children.push(nodes[item.uuid]);
    } else {
      tree.push(nodes[item.uuid]);
    }
  });

  return tree;
};


export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("data/response_1713955778759.json")
      .then((response) => response.json())
      .then((jsonData) => {
        setData(createTree(jsonData));
      })
      .catch((error) => console.error("Error fetching the data:", error));
  }, []);

  return (
    <div className="bg-gray-100 w-screen h-screen overflow-scroll justify-center items-center flex">
      <Tree data={data} />
    </div>
  );
}
