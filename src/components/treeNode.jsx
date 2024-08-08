import React, { useEffect, useState, useRef } from "react";

const TreeNode = ({ node, onClick, isOpen, setNodePosition }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      if (nodeRef.current) {
        const rect = nodeRef.current.getBoundingClientRect();
        setNodePosition(node.uuid, {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX + rect.width / 2,
        });
      }
    };

    // Add event listeners for resizing and scrolling
    const resizeObserver = new ResizeObserver(updatePosition);
    if (nodeRef.current) {
      resizeObserver.observe(nodeRef.current);
    }

    // Initial position update
    updatePosition();

    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      if (nodeRef.current) {
        resizeObserver.unobserve(nodeRef.current);
      }
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  return (
    <li className="text-xs inline m-6" ref={nodeRef}>
      <div
        className={`w-40 h-20 rounded-md bg-white cursor-pointer border-2 p-2 flex justify-between ${
          isOpen ? "border-red-700" : "border-green-700"
        }`}
        onClick={() => onClick(node.uuid)}
      >
        <span>{node.entity.title}</span>
      </div>
      {isOpen && node.children.length > 0 && (
        <ul className="flex justify-between">
          {node.children.map((child) => (
            <TreeNode
              key={child.uuid}
              node={child}
              onClick={onClick}
              isOpen={child.isOpen}
              setNodePosition={setNodePosition}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
