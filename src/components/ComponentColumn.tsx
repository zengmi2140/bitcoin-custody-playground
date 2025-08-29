import React from 'react';
import { ComponentState } from '../types';

interface Component {
  id: string;
  name: string;
  logo: string;
}

interface ComponentColumnProps {
  title: string;
  components: Component[];
  selectedComponents: string[];
  getComponentState: (componentId: string) => ComponentState;
  onComponentClick: (componentId: string) => void;
  type: 'signer' | 'wallet' | 'node';
}

const ComponentColumn: React.FC<ComponentColumnProps> = ({
  title,
  components,
  selectedComponents,
  getComponentState,
  onComponentClick,
  type
}) => {
  return (
    <div className="component-column">
      <h2 className="column-title">{title}</h2>
      <div className="components-grid">
        {components.map((component) => {
          const state = getComponentState(component.id);
          const isSelected = selectedComponents.includes(component.id);
          
          return (
            <div
              key={component.id}
              className={`component-item ${state} ${isSelected ? 'selected' : ''}`}
              onClick={() => onComponentClick(component.id)}
            >
              <div className="component-logo">
                {component.logo}
              </div>
              <div className="component-name">
                {component.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComponentColumn;