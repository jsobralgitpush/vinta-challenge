import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import * as commitAPI from '../api/CommitAPI';
import Form from '../components/RepoCreateForm';

const RepoCreateContainer = ({errorMessage, successMessage}) => {
  const dispatch = useDispatch();

  const submit = useCallback((values) => {
    const token = document.getElementById('main').dataset.csrftoken;
    const name = values.name.split('/')[1];
    const v = { ...values, name };
    return commitAPI.createRepository(v, { 'X-CSRFToken': token }, dispatch);
  }, [dispatch]);

  return <Form onSubmit={submit} successMessage={successMessage} errorMessage={errorMessage} />;
};

RepoCreateContainer.propTypes = {
  successMessage: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
};

const mapStateToProps = (store) => ({
  errorMessage: store.commitState.errorMessage,
  successMessage: store.commitState.successMessage,
});

export default connect(mapStateToProps)(RepoCreateContainer);
