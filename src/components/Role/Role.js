import './Role.scss'
import { useState, useEffect, useRef } from 'react'
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import { createRoles } from '../../services/rolesService';
import TableRole from './TableRole';

const Role = () => {
    const [listChild, setListChild] = useState({
        child: { url: "", description: "", isValidUrl: true },
    })
    const childRef = useRef()

    const handleOnChangeInput = (key, value, name) => {
        let _listChild = _.cloneDeep(listChild)
        _listChild[key][name] = value
        if (value && name === 'url') {
            _listChild[key]['isValidUrl'] = true
        }
        setListChild(_listChild)
    }

    const addNewRoles = () => {
        let _listChild = _.cloneDeep(listChild)
        _listChild['child', uuidv4()] = {
            url: '',
            description: '',
            isValidUrl: true
        }
        setListChild(_listChild)
    }

    const deleteRoles = (key) => {
        let _listChild = _.cloneDeep(listChild)
        delete _listChild[key]
        setListChild(_listChild)
    }

    // Convert data from object to array
    const buildData = () => {
        let data = []
        Object.entries(listChild).map(([key, value]) => {
            data.push({
                url: value.url,
                description: value.description
            })
        })
        return data
    }

    const handleSaveRoles = async () => {
        let invalidObj = Object.entries(listChild).find(([key, value]) => {
            return !value.url
        })

        if (!invalidObj) {
            let data = buildData()
            let res = await createRoles(data)
            if (res && res.EC === "1") {
                childRef.current.fetchRolesBySave()
                toast.success(res.EM)
                setListChild({ child: { url: "", description: "", isValidUrl: true } })
            } else {
                toast.error(res.EM)
            }

        } else {
            let _listChild = _.cloneDeep(listChild)
            _listChild[invalidObj[0]]['isValidUrl'] = false
            setListChild(_listChild)
            toast.error("You must be enter URL.")
        }

    }

    const handleRefresh = async () => {
        childRef.current.fetchRolesBySave()
    }


    return (
        <div className='Role-component'>
            <div className='container mt-3'>
                <div className='row'>
                    <div className='col-8'>
                        <span className='fw-medium fs-2'><i className="fa fa-users"></i> Roles List</span>
                    </div>
                    <div className='col-4'>
                        <span className='btn btn-success fw-medium' onClick={() => { addNewRoles() }}><i className="fa fa-plus-circle"></i> Add more role</span>
                        <span className='btn btn-primary fw-medium mx-3' onClick={() => { handleRefresh() }}><i className="fa fa-refresh"></i> Refresh</span>
                    </div>
                </div>
            </div>
            <div className='container parent'>
                {
                    Object.entries(listChild).map(([key, value], index) => {
                        return (
                            <div className={`row child mb-1 ${key}`} key={key}>
                                <div className='col-5 box'>
                                    <label className='py-1 fw-medium'>URL</label>
                                    <input className={value.isValidUrl ? 'form-control' : 'form-control is-invalid'}
                                        value={value.url}
                                        onChange={(event) => { handleOnChangeInput(key, event.target.value, 'url') }} />
                                </div>
                                <div className='col-5 box'>
                                    <label className='py-1 fw-medium'>Description</label>
                                    <input className='form-control' value={value.description}
                                        onChange={(event) => { handleOnChangeInput(key, event.target.value, 'description') }} />
                                </div>
                                <div className='col-2 box'>
                                    {index >= 1 && <span onClick={() => { deleteRoles(key) }}><i className="fa fa-trash-o text-danger fs-2 marginButton"></i></span>}
                                </div>
                            </div>
                        )
                    })
                }

            </div>
            <div className='container mt-3'>
                <div className='row'>
                    <div className='col-2'>
                        <button className='btn btn-success' onClick={() => { handleSaveRoles() }}>Save</button>
                    </div>
                </div>
            </div>

            <div className='container mt-3'>
                <TableRole ref={childRef}/>
            </div>
        </div>
    )
}

export default Role;