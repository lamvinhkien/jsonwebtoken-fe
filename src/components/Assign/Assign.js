import { useEffect, useState, useContext } from 'react';
import { getAllGroupByAdmin, getGroupWithRoles, assignRoleForGroup } from '../../services/groupService';
import { getAllRolesWithoutPage } from '../../services/rolesService';
import './Assign.scss'
import { toast } from 'react-toastify';
import _ from 'lodash'
import { UserContext } from '../Context/Context';

const Assign = (props) => {
    const [listGroup, setListGroup] = useState([])
    const [listRole, setListRole] = useState([])
    const [selectGroup, setSelectGroup] = useState('')
    const { user, fetchUser } = useContext(UserContext)

    const fetchGroup = async () => {
        let res = await getAllGroupByAdmin()
        if (res && res.EC === '1') {
            setListGroup(res.DT)
        } else {
            toast.error(res.EM)
            setListGroup([])
        }
    }

    const fetchRole = async () => {
        let res = await getAllRolesWithoutPage()
        if (res && res.EC === '1') {
            setListRole(res.DT)
        } else {
            toast.error(res.EM)
            setListRole([])
        }
    }

    const fetchGroupWithRoles = async (id) => {
        let res = await getGroupWithRoles(id)
        if (res && res.EC === '1') {
            return res.DT.Roles
        } else {
            toast.error(res.EM)
            return []
        }
    }

    const buildDataForAssign = (groupWithRoles) => {
        let _listRole = _.cloneDeep(listRole)

        if (_listRole && _listRole.length > 0) {
            _listRole.forEach((value, index) => {
                let compare = groupWithRoles.some(item => item.url === value.url)
                if (compare) {
                    _listRole[index].isAssign = true
                } else {
                    _listRole[index].isAssign = false
                }
            })

            setListRole(_listRole)
        } else {
            setListRole([])
        }
    }

    const handleOnChangeSelect = async (event) => {
        if (event) {
            let res = await fetchGroupWithRoles(event)
            setSelectGroup(event)
            buildDataForAssign(res)
        } else {
            setSelectGroup('')
            buildDataForAssign([])
        }
    }

    const handleOnChangeRoles = (index) => {
        let _listRole = _.cloneDeep(listRole)
        _listRole[index].isAssign = !_listRole[index].isAssign
        setListRole(_listRole)
    }

    const buildDataForSave = () => {
        let result = {}
        let _listRole = _.cloneDeep(listRole)

        result.user = user
        result.user.groupId = user.data ? user.data.id : ''
        result.groupId = +selectGroup
        result.roles = []

        _listRole.forEach((item, index) => {
            if (item.isAssign === true) {
                result.roles.push({ groupId: +selectGroup, roleId: item.id })
            }
        })

        return result;
    }

    const handleSave = async () => {
        let data = buildDataForSave()
        let res = await assignRoleForGroup(data)

        if (res && res.EC === '1') {
            await fetchUser()
            toast.success(res.EM)
        } else {
            toast.error(res.EM)
        }
    }

    useEffect(() => {
        fetchGroup()
        fetchRole()
    }, [])

    return (
        <div className='content-card-body'>
            <div className="row align-items-center">
                <div className='col-12'>
                    <span className='fw-bold fs-4 text-info'><i className="fa fa-users"></i> Assign roles to groups</span>
                    <hr />
                </div>
                <div className='col-md-12'>
                    <span className='fw-medium fs-5'>• Select group</span>
                </div>
                <div className='col-md-6 col-lg-6 mt-2'>
                    <select className="form-select form-select-lg" onChange={(event) => { handleOnChangeSelect(event.target.value) }}>
                        <option value={``}>Please select group</option>
                        <option value={``}>-----------------------</option>
                        {
                            listGroup && listGroup.length > 0
                                ?
                                listGroup.map((item, index) => {
                                    return (
                                        <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                    )
                                })
                                :
                                <option>Group loading.......</option>
                        }
                    </select>
                </div>
            </div>
            <hr />
            <div className='row'>
                <div className='title-roles col-12'>
                    <span className='fw-medium fs-5'>• Roles of group selected</span>
                </div>

                {
                    selectGroup !== ''
                        ?
                        <>
                            <div className='row mt-1'>
                                {
                                    listRole && listRole.length > 0
                                        ? listRole.map((item, index) => {
                                            return (
                                                <div className='col-12 col-sm-6 col-md-4' key={`role-${index}`}>
                                                    <div className="form-check form-switch py-1 select-fs" >
                                                        <input
                                                            className="form-check-input" type="checkbox" id={`role-${index}`}
                                                            value={item.id}
                                                            checked={item.isAssign}
                                                            onChange={() => { handleOnChangeRoles(index) }}
                                                        />

                                                        <label className="form-check-label" htmlFor={`role-${index}`}>{item.description}</label>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        : <div className='col-12'>Loading data......</div>
                                }
                            </div>
                            <div className='col-12 col-md-3 col-lg-2 mt-3'>
                                <button className='btn btn-success w-100' onClick={() => { handleSave() }}>Save</button>
                            </div>
                        </>
                        :
                        <div className='row mt-2'>
                            <div className='col-12'>
                                <span className='fst-italic fs-5'>Please select a group to show roles...</span>
                            </div>
                        </div>

                }
            </div>
        </div>
    )
}

export default Assign;