import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import Button from '../components/Button';

const PAGE_SIZE = 10;

function Notifications() {
    const [data, setData] = useState({
        items: [],
        currentPage: 0,
        total: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [respondingId, setRespondingId] = useState(null);

    const fetchNotifications = (page = 0) => {
        setLoading(true);
        setTimeout(() => {
            const start = page * PAGE_SIZE;
            setData({
                items: SAMPLE_NOTIFICATIONS.slice(start, start + PAGE_SIZE),
                currentPage: page,
                total: SAMPLE_NOTIFICATIONS.length,
                totalPages: Math.ceil(SAMPLE_NOTIFICATIONS.length / PAGE_SIZE),
            });
            setLoading(false);
        }, 200);
    };

    useEffect(() => {
        fetchNotifications(0);
    }, []);

    const respond = (id, accepted) => {
        setRespondingId(id);
        setTimeout(() => {
            const target = SAMPLE_NOTIFICATIONS.find((n) => n.id === id);
            if (target) {
                target.action = true;
                target.accepted = accepted;
            }
            toast.success(accepted ? 'Invitation accepted' : 'Invitation declined');
            fetchNotifications(data.currentPage);
            setRespondingId(null);
        }, 200);
    };

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
                    <p className="text-sm text-slate-500">
                        Room invitations and updates.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center w-full h-full mt-4"><Loader /></div>
            ) : (
                <>
                    {data.items.length === 0 ? (
                        <div className="w-full rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                            No notifications yet.
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Message</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {data.items.map((n) => {
                                        const pending = !n?.action;
                                        return (
                                            <tr key={n.id} className="text-slate-700">
                                                <td className="px-4 py-3 text-sm text-slate-800">
                                                    <span className="font-semibold">{n?.sender || 'Someone'}</span>{' '}
                                                    invited you to join the chat room{' '}
                                                    <span className="font-semibold">{n?.roomName}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {pending ? (
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                isLoading={respondingId === n.id}
                                                                onClick={() => respond(n.id, false)}
                                                                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                                                            >
                                                                Decline
                                                            </Button>
                                                            <Button
                                                                isLoading={respondingId === n.id}
                                                                onClick={() => respond(n.id, true)}
                                                                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
                                                            >
                                                                Accept
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <span
                                                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium float-right ${
                                                                n?.accepted
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-red-100 text-red-700'
                                                            }`}
                                                        >
                                                            {n?.accepted ? 'Accepted' : 'Declined'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {data.totalPages > 0 && (
                        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row">
                            <div>
                                Page <span className="font-semibold text-slate-800">{data.currentPage + 1}</span> of{' '}
                                <span className="font-semibold text-slate-800">{data.totalPages}</span>
                                <span className="mx-2 text-slate-300">|</span>
                                Total <span className="font-semibold text-slate-800">{data.total}</span>{' '}
                                {data.total === 1 ? 'notification' : 'notifications'}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => fetchNotifications(data.currentPage - 1)}
                                    disabled={data.currentPage <= 0}
                                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => fetchNotifications(data.currentPage + 1)}
                                    disabled={data.currentPage + 1 >= data.totalPages}
                                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Notifications;
