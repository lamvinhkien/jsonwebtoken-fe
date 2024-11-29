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
        <div className='Group-component container'>
            <div className='mt-3'>
                <div className='row'>
                    <div className='col-8'>
                        <span className='fw-medium fs-2'><i className="fa fa-users"></i> Groups List</span>
                    </div>
                    <div className='col-4'>
                        <span className='btn btn-success fw-medium' onClick={() => { addNewGroups() }}><i className="fa fa-plus-circle"></i> Add more group</span>
                        <span className='btn btn-primary fw-medium mx-3' onClick={() => { handleRefresh() }}><i className="fa fa-refresh"></i> Refresh</span>
                    </div>
                </div>
            </div>
            
            <hr />

            <div className='parent'>
                {
                    Object.entries(listChild).map(([key, value], index) => {
                        return (
                            <div className={`row child mb-1 ${key}`} key={key}>
                                <div className='col-5 box'>
                                    <label className='py-1 fw-medium'>Name</label>
                                    <input className={value.isValidName ? 'form-control' : 'form-control is-invalid'}
                                        value={value.name}
                                        onChange={(event) => { handleOnChangeInput(key, event.target.value, 'name') }} />
                                </div>
                                <div className='col-5 box'>
                                    <label className='py-1 fw-medium'>Description</label>
                                    <input className='form-control' value={value.description}
                                        onChange={(event) => { handleOnChangeInput(key, event.target.value, 'description') }} />
                                </div>
                                <div className='col-2 box'>
                                    {index >= 1 && <span onClick={() => { deleteGroups(key) }}><i className="fa fa-trash-o text-danger fs-2 marginButton"></i></span>}
                                </div>
                            </div>
                        )
                    })
                }

            </div>
            <div className='mt-3'>
                <div className='row'>
                    <div className='col-2'>
                        <button className='btn btn-success' onClick={() => { handleSaveGroups() }}>Save</button>
                    </div>
                </div>
            </div>

            <hr />

            <div className='mt-3'>
                <TableGroup ref={childRef}/>
            </div>
        </div>
    )
}

export default Group;