"use client";
import React, { useEffect, useState, useRef } from "react";

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

const TreeNode = ({ node, onClick, isOpen, handleDragStart, handleDrop }) => {
  const nodeRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [positionType, setPositionType] = useState("top-left"); // "top-left", "center-top", "center-bottom"

  useEffect(() => {
    if (nodeRef.current) {
      const updatePosition = () => {
        const rect = nodeRef.current.getBoundingClientRect();
        let top, left;

        if (positionType === "center-top") {
          top = rect.top + window.scrollY;
          left = rect.left + window.scrollX + rect.width / 2;
        } else if (positionType === "center-bottom") {
          top = rect.bottom + window.scrollY;
          left = rect.left + window.scrollX + rect.width / 2;
        } else {
          top = rect.top + window.scrollY;
          left = rect.left + window.scrollX;
        }

        setPosition({ top, left });
      };

      const observer = new MutationObserver(updatePosition);
      observer.observe(nodeRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });

      // Initial position update
      updatePosition();

      return () => observer.disconnect();
    }
  }, [isOpen, positionType]);

  return (
    <li
      className="text-xs inline m-6"
      ref={nodeRef}
      draggable
      onDragStart={(e) => handleDragStart(e, node)}
      onDrop={(e) => handleDrop(e, node)}
      onDragOver={(e) => e.preventDefault()}
    >
      <div
        className={`w-40 h-20 rounded-md bg-white cursor-pointer border-2 p-2 flex justify-between ${
          isOpen ? "border-red-700" : "border-green-700"
        }`}
        onClick={() => onClick(node.uuid)}
      >
        <span>{node.entity.title}</span>
        <div className="text-xs">
          ({position.top.toFixed(0)}, {position.left.toFixed(0)})
          <div
            className="absolute bg-red-500 w-2 h-2 rounded-full"
            style={{
              top: `${position.top.toFixed(0)}px`,
              left: `${position.left.toFixed(0)}px`,
            }}
          ></div>
        </div>
      </div>
      {isOpen && node.children.length > 0 && (
        <ul className="flex justify-between ">
          {node.children.map((child) => (
            <TreeNode
              key={child.uuid}
              node={child}
              onClick={onClick}
              isOpen={child.isOpen}
              handleDragStart={handleDragStart}
              handleDrop={handleDrop}
              positionType={positionType}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const Tree = ({ data }) => {
  const [openNodes, setOpenNodes] = useState(new Set());

  const handleNodeClick = (uuid) => {
    setOpenNodes((prevOpenNodes) => {
      const newOpenNodes = new Set(prevOpenNodes);
      if (newOpenNodes.has(uuid)) {
        newOpenNodes.delete(uuid);
      } else {
        newOpenNodes.add(uuid);
      }
      return newOpenNodes;
    });
  };

  const addIsOpenProperty = (nodes) => {
    return nodes.map((node) => ({
      ...node,
      isOpen: openNodes.has(node.uuid),
      children: addIsOpenProperty(node.children),
    }));
  };

  const treeDataWithState = addIsOpenProperty(data || []);

  return (
    <ul>
      {treeDataWithState.map((node) => (
        <TreeNode
          key={node.uuid}
          node={node}
          onClick={handleNodeClick}
          isOpen={node.isOpen}
        />
      ))}
    </ul>
  );
};

export default function Box() {
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
    <div className="bg-gray-100 w-screen h-screen overflow-scroll justify-center items-center flex ">
      <Tree data={data} />
    </div>
  );
}
