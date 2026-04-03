import { useState, useCallback } from 'react';
import { complaintApi } from '@/lib/api';
import {
  Complaint,
  CreateComplaintRequest,
  ComplaintQueryParams,
  ComplaintStatus,
} from '@shared/api';

export const useComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    total: 0,
  });

  const fetch = useCallback(async (params?: ComplaintQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await complaintApi.getAll(params);

      if (response.data?.complaints) {
        setComplaints(response.data.complaints);
        setPagination({
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
          total: response.data.total,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch complaints');
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch complaints';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMy = useCallback(async (params?: ComplaintQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await complaintApi.getMy(params);

      if (response.data?.complaints) {
        setComplaints(response.data.complaints);
        setPagination({
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
          total: response.data.total,
        });
      } else {
        throw new Error(response.message || 'Failed to fetch complaints');
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch complaints';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: CreateComplaintRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await complaintApi.create(data);

      if (response.data?.complaint) {
        return response.data.complaint;
      } else {
        throw new Error(response.message || 'Failed to create complaint');
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create complaint';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await complaintApi.getById(id);

      if (response.data?.complaint) {
        return response.data.complaint;
      } else {
        throw new Error(response.message || 'Failed to fetch complaint');
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch complaint';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(
    async (id: string, status: ComplaintStatus, remarks?: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await complaintApi.updateStatus(id, {
          status,
          remarks,
        });

        if (response.data?.complaint) {
          return response.data.complaint;
        } else {
          throw new Error(response.message || 'Failed to update status');
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update status';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const addRemark = useCallback(async (id: string, text: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await complaintApi.addRemark(id, { text });

      if (response.data?.complaint) {
        return response.data.complaint;
      } else {
        throw new Error(response.message || 'Failed to add remark');
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to add remark';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByStatus = useCallback(
    async (status: ComplaintStatus, params?: ComplaintQueryParams) => {
      try {
        setLoading(true);
        setError(null);
        const response = await complaintApi.getByStatus(status, params);

        if (response.data?.complaints) {
          setComplaints(response.data.complaints);
          setPagination({
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage,
            total: response.data.total,
          });
        } else {
          throw new Error(response.message || 'Failed to fetch complaints');
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to fetch complaints';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    complaints,
    loading,
    error,
    pagination,
    fetch,
    fetchMy,
    create,
    getById,
    updateStatus,
    addRemark,
    fetchByStatus,
  };
};
