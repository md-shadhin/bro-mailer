import React from 'react';

interface TypeToolbarProps {
  selectedType: string;
  setSelectedTypeId: (id: string) => void;
}

const TypeToolbar: React.FC<TypeToolbarProps> = (props) => {

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setSelectedTypeId(event.target.id);
    localStorage.setItem('leaveType', event.target.id);
  };

  return (
    <div className="type-toolbar">
      <input
        type="radio"
        id="radioEarlyLeave"
        name="type"
        checked={props.selectedType === 'radioEarlyLeave'}
        onChange={handleTypeChange}
      />
      <label htmlFor="radioEarlyLeave">Early Leave Mail</label>

      <input
        type="radio"
        id="radioPlannedLeave"
        name="type"
        checked={props.selectedType === 'radioPlannedLeave'}
        onChange={handleTypeChange}
      />
      <label htmlFor="radioPlannedLeave">Planned Leave Mail</label>
    </div>
  );
};

export default TypeToolbar;
