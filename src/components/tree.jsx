import React, { useEffect, useState, useRef } from "react";
import TreeNode from "./treeNode";

const Tree = ({ data }) => {
  const [openNodes, setOpenNodes] = useState(new Set());
  const [nodePositions, setNodePositions] = useState({});

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

  const setNodePosition = (uuid, position) => {
    setNodePositions((prevPositions) => ({
      ...prevPositions,
      [uuid]: position,
    }));
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
    <div className="relative">
      <svg
        className="absolute top-0 left-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      >
        {Object.entries(nodePositions).map(([parentUuid, parentPosition]) =>
          treeDataWithState
            .filter((node) =>
              node.children.some((child) => child.uuid === parentUuid)
            )
            .map((parentNode) => {
              const parentPos = nodePositions[parentNode.uuid];
              return parentNode.children.map((child) => {
                const childPos = nodePositions[child.uuid];
                return (
                  <line
                    key={`${parentNode.uuid}-${child.uuid}`}
                    x1={parentPos.left}
                    y1={parentPos.top + 20}
                    x2={childPos.left}
                    y2={childPos.top}
                    stroke="black"
                    strokeWidth="2"
                  />
                );
              });
            })
        )}
      </svg>
      <ul>
        {treeDataWithState.map((node) => (
          <TreeNode
            key={node.uuid}
            node={node}
            onClick={handleNodeClick}
            isOpen={node.isOpen}
            setNodePosition={setNodePosition}
          />
        ))}
      </ul>
    </div>
  );
};

export default Tree;
