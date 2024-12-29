import './Group.scss'
import { useState, useRef } from 'react'
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import { createGroups } from '../../services/groupService';
import TableGroup from './TableGroup';

const Group = () => {
    const [listChild, setListChild] = useState({
        child: { name: "", description: "", isValidName: true },
    })
    const childRef = useRef()

    const handleOnChangeInput = (key, value, name) => {
        let _listChild = _.cloneDeep(listChild)
        _listChild[key][name] = value
        if (value && name === 'name') {
            _listChild[key]['isValidName'] = true
        }
        setListChild(_listChild)
    }

    const addNewGroups = () => {
        let _listChild = _.cloneDeep(listChild)
        _listChild['child' + uuidv4()] = {
            name: '',
            description: '',
            isValidName: true
        }
        setListChild(_listChild)
    }

    const deleteGroups = (key) => {
        let _listChild = _.cloneDeep(listChild)
        delete _listChild[key]
        setListChild(_listChild)
    }

    // Convert data from object to array
    const buildData = () => {
        let data = []
        Object.entries(listChild).forEach(([key, value]) => {
            data.push({
                name: value.name,
                description: value.description
            })
        })
        return data
    }

    const handleSaveGroups = async () => {
        let invalidObj = Object.entries(listChild).find(([key, value]) => {
            return !value.name
        })

        if (!invalidObj) {
            let data = buildData()
            let res = await createGroups(data)
            if (res && res.EC === "1") {
                childRef.current.fetchGroupsBySave()
                toast.success(res.EM)
                setListChild({ child: { name: "", description: "", isValidName: true } })
            } else {
                toast.error(res.EM)
            }

        } else {
            let _listChild = _.cloneDeep(listChild)
            _listChild[invalidObj[0]]['isValidName'] = false
            setListChild(_listChild)
            toast.error("You must be enter Name.")
        }

    }

    const handleRefresh = async () => {
        childRef.current.fetchGroupsBySave()
    }


    return (
        <div className='content-card-body'>
            <div className='row'>
                <div className='col-12 d-flex justify-content-center col-sm-4 d-sm-flex justify-content-sm-start'>
                    <span className='fw-bold fs-4 text-info'><i className="fa fa-users"></i> Group</span>
                </div>
                <div className='col-12 d-flex justify-content-center mt-2 col-sm-8 d-sm-flex justify-content-sm-end mt-sm-0 gap-2'>
                    <button className='btn btn-success fw-medium mt-1' onClick={() => { addNewGroups() }}><i className="fa fa-plus-circle"></i> Add more</button>
                    <button className='btn btn-primary fw-medium mt-1' onClick={() => { handleRefresh() }}><i className="fa fa-refresh"></i> Refresh</button>
                </div>
            </div>
            <hr />
            {
                Object.entries(listChild).map(([key, value], index) => {
                    return (
                        <div className='row mb-3' key={index}>
                            <div className='col-lg-5'>
                                <label className='fw-medium'>{index + 1}. Name</label>
                                <input className={value.isValidName ? 'form-control' : 'form-control is-invalid'}
                                    value={value.name}
                                    onChange={(event) => { handleOnChangeInput(key, event.target.value, 'name') }} />
                            </div>
                            <div className='pt-2 col-lg-6 pt-lg-0'>
                                <label className='fw-medium'>{index + 1}. Description</label>
                                <input className='form-control' value={value.description}
                                    onChange={(event) => { handleOnChangeInput(key, event.target.value, 'description') }} />
                            </div>
                            <div className='pt-2 col-lg-1 pt-lg-4'>
                                {index >= 1 && <button onClick={() => { deleteGroups(key) }} className='btn btn-danger w-100'><i className="fa fa-trash-o"></i></button>}
                            </div>
                        </div>
                    )
                })
            }

            <div className='row mt-3'>
                <div className='col-12 col-md-3 col-lg-2'>
                    <button className='btn btn-success w-100' onClick={() => { handleSaveGroups() }}>Save</button>
                </div>
            </div>

            <hr />

            <TableGroup ref={childRef} />
        </div>
    )
}

export default Group;