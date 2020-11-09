import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Icon, IconButton, Table, Avatar } from 'rsuite';
import { ModelAction } from './../../Table/ActionButtons';
import { ActionCell, AvatarCell, NestedCell } from './../../Table/TableCells';
import { loadList } from './../../../store/slices/users.slice';
import { omit, toNumber, upperFirst } from 'lodash';
import * as moment from 'moment';
const { Column, Cell, HeaderCell, Pagination } = Table;

const UsersTable = ({ loadList, usersList, usersListMeta, loading }) => {
  const [displayLength, setDisplayLength] = useState(10);

  useEffect(() => {
    loadList({ perPage: displayLength, page: 1 });
  }, [loadList, displayLength]);

  const setPage = (page) => {
    loadList({ perPage: displayLength, page });
  };

  const handleChangeLength = (dataKey) => {
    setDisplayLength(dataKey);
    setPage(1);
  };

  return (
    <div>
      <Table height={520} data={usersList} loading={loading}>
        <Column width={50} align='center' fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey='id' />
        </Column>

        <Column width={50} fixed>
          <HeaderCell>Avatar</HeaderCell>
          <AvatarCell dataKey='name' />
        </Column>
        <Column width={200} fixed>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey='name' />
        </Column>

        <Column width={250}>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey='email' />
        </Column>
        <Column width={150}>
          <HeaderCell>Role</HeaderCell>
          <NestedCell
            dataKey='role'
            formatCell={(rowData) => upperFirst(rowData['role'])}
          />
        </Column>
        <Column width={150}>
          <HeaderCell>Created Date</HeaderCell>
          <NestedCell
            dataKey='createdAt'
            formatCell={(rowData) =>
              moment(rowData['createdAt']).format('DD/MM/YYYY')
            }
          />
        </Column>
        <Column width={150}>
          <HeaderCell>Updated Date</HeaderCell>
          <NestedCell
            dataKey='updatedAt'
            formatCell={(rowData) =>
              moment(rowData['updatedAt']).format('DD/MM/YYYY')
            }
          />
        </Column>
        <Column width={100} fixed='right'>
          <HeaderCell>Action</HeaderCell>
          <ActionCell dataKey='id'>
            <ModelAction
              modelName='CreateEditUserModel'
              icon='edit2'
              tooltip='Edit User'
              modelTransform={(rowData) => ({
                type: 'edit',
                id: rowData.id,
                initialValues: omit(rowData, ['_parent', 'children']),
              })}
            />
            <ModelAction
              modelName='DeleteUserModel'
              icon='trash'
              tooltip='Delete User'
              modelTransform={(rowData) => ({
                type: 'delete',
                id: rowData.id,
                name: rowData.name,
              })}
            />
          </ActionCell>
        </Column>
      </Table>

      <Pagination
        className='t-py-1 t-px-1'
        lengthMenu={[
          {
            value: 10,
            label: 10,
          },
          {
            value: 20,
            label: 20,
          },
        ]}
        activePage={toNumber(usersListMeta.page)}
        displayLength={displayLength}
        total={usersListMeta.total}
        onChangePage={setPage}
        onChangeLength={handleChangeLength}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  usersList: state.users.usersList,
  usersListMeta: state.users.usersListMeta,
  loading: state.users.loading,
});

const mapDispatchToProps = { loadList };

export default connect(mapStateToProps, mapDispatchToProps)(UsersTable);
