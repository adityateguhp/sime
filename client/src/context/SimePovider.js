import React, { useState } from 'react';

const SimeContext = React.createContext();

const SimeProvider = (props) => {
  const [user, setUser] = useState(null);
  const [user_type, setUser_type] = useState(null);
  const [department_id, setDepartment_id] = useState('');
  const [department_name, setDepartment_name] = useState('');
  const [department_position_id, setDepartment_position_id] = useState('');
  const [department_position_name, setDepartment_position_name] = useState('');
  const [project_id, setProject_id] = useState('');
  const [project_name, setProject_name] = useState('');
  const [event_id, setEvent_id] = useState('');
  const [event_name, setEvent_name] = useState('');
  const [roadmap_name, setRoadmap_name] = useState('');
  const [roadmap_id, setRoadmap_id] = useState('');
  const [staff_name, setStaff_name] = useState('');
  const [staff_id, setStaff_id] = useState('');
  const [position_id, setPosition_id] = useState('');
  const [position_name, setPosition_name] = useState('');
  const [committee_id, setCommittee_id] = useState('');
  const [committee_name, setCommittee_name] = useState('');
  const [external_id, setExternal_id] = useState('');
  const [external_name, setExternal_name] = useState('');
  const [external_type, setExternal_type] = useState('');
  const [external_type_name, setExternal_type_name] = useState('');
  const [rundown_id, setRundown_id] = useState('');
  const [rundown_agenda, setRundown_agenda] = useState('');
  const [person_in_charge_id, setPerson_in_charge_id] = useState('');
  const [order, setOrder] = useState('');
  const [userPersonInChargeId, setUserPersonInChargeId] = useState('');
  const [userPicCommittee, setUserPicCommittee] = useState('');
  return (
    <SimeContext.Provider
      value={{
        user,
        user_type,
        department_id,
        department_name,
        department_position_id,
        department_position_name,
        project_id,
        project_name,
        event_id,
        event_name,
        roadmap_id,
        roadmap_name,
        staff_name,
        staff_id,
        position_id,
        position_name,
        committee_id,
        committee_name,
        external_id,
        external_name,
        external_type,
        external_type_name,
        rundown_id,
        rundown_agenda,
        person_in_charge_id,
        order,
        userPersonInChargeId,
        userPicCommittee,
        setUser,
        setUser_type,
        setDepartment_id,
        setDepartment_name,
        setDepartment_position_id,
        setDepartment_position_name,
        setProject_id,
        setProject_name,
        setEvent_id,
        setEvent_name,
        setRoadmap_id,
        setRoadmap_name,
        setStaff_name,
        setStaff_id,
        setPosition_id,
        setPosition_name,
        setCommittee_id,
        setCommittee_name,
        setExternal_id,
        setExternal_name,
        setExternal_type,
        setExternal_type_name,
        setRundown_id,
        setRundown_agenda,
        setPerson_in_charge_id,
        setOrder,
        setUserPersonInChargeId,
        setUserPicCommittee
      }}
    >
      {props.children}
    </SimeContext.Provider>
  )
}

export { SimeProvider, SimeContext };
