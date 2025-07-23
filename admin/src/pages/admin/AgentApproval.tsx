import React, { useState } from 'react';
import { Check, X, Eye, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface AgentRequest {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  experience?: string;
  motivation?: string;
  profilePicture?: string;
  documentsSubmitted: boolean;
}

const AgentApproval: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<AgentRequest | null>(null);

  // Mock data - replace with actual API calls
  const agentRequests: AgentRequest[] = [
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Cooper',
      userName: 'alicecooper',
      email: 'alice@example.com',
      phoneNumber: '+1-555-0123',
      address: '123 Main St, New York, NY',
      requestDate: '2024-01-15',
      status: 'pending',
      experience: '5 years in retail sales',
      motivation: 'I want to help customers find the best products',
      documentsSubmitted: true
    },
    {
      id: '2',
      firstName: 'Bob',
      lastName: 'Smith',
      userName: 'bobsmith',
      email: 'bob@example.com',
      phoneNumber: '+1-555-0456',
      requestDate: '2024-01-14',
      status: 'pending',
      experience: '3 years in e-commerce',
      motivation: 'Looking to expand my online business',
      documentsSubmitted: false
    },
    {
      id: '3',
      firstName: 'Carol',
      lastName: 'Johnson',
      userName: 'caroljohnson',
      email: 'carol@example.com',
      requestDate: '2024-01-13',
      status: 'approved',
      experience: '7 years in digital marketing',
      motivation: 'Passionate about connecting buyers with sellers',
      documentsSubmitted: true
    },
    {
      id: '4',
      firstName: 'David',
      lastName: 'Brown',
      userName: 'davidbrown',
      email: 'david@example.com',
      requestDate: '2024-01-12',
      status: 'rejected',
      experience: 'New to sales',
      motivation: 'Want to try something new',
      documentsSubmitted: false
    }
  ];

  const handleApproval = (requestId: string, approved: boolean) => {
    // API call to approve/reject agent request
    console.log(`${approved ? 'Approving' : 'Rejecting'} agent request ${requestId}`);
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const pendingRequests = agentRequests.filter(req => req.status === 'pending');
  const processedRequests = agentRequests.filter(req => req.status !== 'pending');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agent Approval</h1>
        <p className="text-gray-600">Review and approve agent applications</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-orange-600">{pendingRequests.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">3</p>
              </div>
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold text-blue-600">89</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Pending Agent Requests ({pendingRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending agent requests
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-medium">
                        {request.firstName.charAt(0)}{request.lastName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">
                            {request.firstName} {request.lastName}
                          </h3>
                          {!request.documentsSubmitted && (
                            <Badge variant="warning">Missing Documents</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">@{request.userName}</p>
                        <p className="text-sm text-gray-600">{request.email}</p>
                        <p className="text-xs text-gray-500">Applied on {request.requestDate}</p>
                        
                        {request.experience && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Experience:</p>
                            <p className="text-sm text-gray-600">{request.experience}</p>
                          </div>
                        )}
                        
                        {request.motivation && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Motivation:</p>
                            <p className="text-sm text-gray-600">{request.motivation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleApproval(request.id, true)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleApproval(request.id, false)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Decisions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Applicant</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Applied Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Documents</th>
                </tr>
              </thead>
              <tbody>
                {processedRequests.map((request) => (
                  <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm">
                          {request.firstName.charAt(0)}{request.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{request.firstName} {request.lastName}</p>
                          <p className="text-sm text-gray-500">{request.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-500">{request.requestDate}</span>
                    </td>
                    <td className="py-4 px-4">
                      {request.documentsSubmitted ? (
                        <Badge variant="success">Complete</Badge>
                      ) : (
                        <Badge variant="warning">Incomplete</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Agent Application Details</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Name:</p>
                <p>{selectedRequest.firstName} {selectedRequest.lastName}</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p>{selectedRequest.email}</p>
              </div>
              {selectedRequest.phoneNumber && (
                <div>
                  <p className="font-medium">Phone:</p>
                  <p>{selectedRequest.phoneNumber}</p>
                </div>
              )}
              {selectedRequest.address && (
                <div>
                  <p className="font-medium">Address:</p>
                  <p>{selectedRequest.address}</p>
                </div>
              )}
              {selectedRequest.experience && (
                <div>
                  <p className="font-medium">Experience:</p>
                  <p>{selectedRequest.experience}</p>
                </div>
              )}
              {selectedRequest.motivation && (
                <div>
                  <p className="font-medium">Motivation:</p>
                  <p>{selectedRequest.motivation}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleApproval(selectedRequest.id, true)}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleApproval(selectedRequest.id, false)}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentApproval;