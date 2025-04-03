import React, { useState, useEffect } from 'react';
import { Modal, Select, InputNumber, Button, Table, message, Tag, Card, Typography, Alert } from 'antd';
import { GiftOutlined, TrophyOutlined, FireOutlined, TeamOutlined, TagOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminSelectWinners = () => {
    const [offers, setOffers] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [packages, setPackages] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [winners, setWinners] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loadingOffers, setLoadingOffers] = useState(false);
    const [loadingPackages, setLoadingPackages] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingWinners, setLoadingWinners] = useState(false);
    const [formData, setFormData] = useState({
        packageId: '',
        numberOfWinners: 1,
        couponNumbers: []
    });

    // Fetch all live/ended offers
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoadingOffers(true);
                const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/admin/offer/view-offers`);
                const data = await res.json();
                setOffers(Array.isArray(data) ? data.filter(offer => offer.status === 'live' || offer.status === 'ended') : []);
            } catch (error) {
                console.error('Error fetching offers:', error);
                message.error('Failed to load offers');
            } finally {
                setLoadingOffers(false);
            }
        };
        fetchOffers();
    }, []);

    // Fetch all packages
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoadingPackages(true);
                const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/admin/packages`);
                const data = await res.json();

                const packagesData = Array.isArray(data) ? data :
                    (data.data || data.packages || []);

                if (!Array.isArray(packagesData)) {
                    throw new Error('Invalid packages data format');
                }

                setPackages(packagesData);
            } catch (error) {
                console.error('Error fetching packages:', error);
                message.error('Failed to load packages');
                setPackages([]);
            } finally {
                setLoadingPackages(false);
            }
        };
        fetchPackages();
    }, []);

    // Fetch winners history
    useEffect(() => {
        const fetchWinners = async () => {
            try {
                setLoadingWinners(true);
                const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/admin/offer/winners`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                const data = await res.json();
                setWinners(data);
            } catch (error) {
                console.error('Error fetching winners:', error);
                message.error('Failed to load winners');
            } finally {
                setLoadingWinners(false);
            }
        };
        fetchWinners();
    }, []);

    const handleSelectOffer = (offer) => {
        // Check if already has 3 winners
        const offerWinners = winners.filter(w => w.offerId?._id === offer._id).length;
        if (offerWinners >= 3) {
            message.warning('This offer already has 3 winners selected');
            return;
        }
        setSelectedOffer(offer);
        setIsModalVisible(true);
    };

    useEffect(() => {
        if (!selectedOffer) return;

        const fetchCoupons = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/admin/offer/${selectedOffer._id}/coupons`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                const data = await res.json();
                setCoupons(data);
            } catch (error) {
                console.error('Error fetching coupons:', error);
            }
        };
        fetchCoupons();
    }, [selectedOffer]);

    const handleSubmit = async () => {
        try {
            setLoadingSubmit(true);
            const token = localStorage.getItem('adminToken');

            if (!formData.packageId) {
                throw new Error('Please select a package');
            }

            // Check if already has 3 winners for this offer
            const existingWinners = winners.filter(w => w.offerId?._id === selectedOffer._id).length;
            const newWinnersCount = formData.couponNumbers.length || formData.numberOfWinners;
            
            if (existingWinners + newWinnersCount > 3) {
                throw new Error(`Cannot select more than 3 winners total for this offer. Already has ${existingWinners} winners.`);
            }

            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/admin/offer/${selectedOffer._id}/announce-winners`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    packageId: formData.packageId,
                    numberOfWinners: formData.numberOfWinners,
                    couponNumbers: formData.couponNumbers
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to announce winners');
            }

            message.success('Winners announced successfully!');
            setWinners([...winners, ...data.winners]);
            setIsModalVisible(false);
            setFormData({
                packageId: '',
                numberOfWinners: 1,
                couponNumbers: []
            });
        } catch (error) {
            console.error('Announcement error:', error);
            message.error(error.message);
        } finally {
            setLoadingSubmit(false);
        }
    };

    const offerColumns = [
        {
            title: (
                <span>
                    <FireOutlined className="mr-2" />
                    Offer Title
                </span>
            ),
            dataIndex: 'title',
            key: 'title',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'live' ? 'green' : 'gray'} className="capitalize">
                    {status}
                </Tag>
            )
        },
        {
            title: 'Winners Selected',
            key: 'winnersCount',
            render: (_, record) => {
                const count = winners.filter(w => w.offerId?._id === record._id).length;
                return (
                    <Tag color={count >= 3 ? 'red' : count > 0 ? 'orange' : 'blue'}>
                        {count}/3
                    </Tag>
                );
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const winnersCount = winners.filter(w => w.offerId?._id === record._id).length;
                return (
                    <Button
                        type={winnersCount >= 3 ? 'default' : 'primary'}
                        icon={<GiftOutlined />}
                        onClick={() => handleSelectOffer(record)}
                        disabled={winnersCount >= 3}
                    >
                        {winnersCount >= 3 ? 'Winners Announced' : 'Announce Winners'}
                    </Button>
                );
            },
        },
    ];

    const winnersColumns = [
        {
            title: (
                <span>
                    <FireOutlined className="mr-2" />
                    Offer
                </span>
            ),
            dataIndex: ['offerId', 'title'],
            key: 'offer',
            render: (_, record) => record.offerId?.title || 'N/A'
        },
        {
            title: (
                <span>
                    <TeamOutlined className="mr-2" />
                    Winner
                </span>
            ),
            dataIndex: ['userId', 'email'],
            key: 'winner',
            render: (_, record) => record.userId?.email || 'N/A'
        },
        {
            title: (
                <span>
                    <TagOutlined className="mr-2" />
                    Coupon Number
                </span>
            ),
            dataIndex: 'couponNumber',
            key: 'couponNumber',
            render: (num) => <Tag>#{num}</Tag>
        },
        {
            title: 'Package',
            dataIndex: ['associatedPackage', 'title'],
            key: 'package',
            render: (_, record) => record.associatedPackage?.title || 'N/A'
        },
        {
            title: 'Announced At',
            dataIndex: 'updatedAt',
            key: 'announcedAt',
            render: (date) => date ? new Date(date).toLocaleString() : 'N/A'
        }
    ];

    return (
        <div className="p-6">
            <Title level={3} className="mb-6">
                <TrophyOutlined className="mr-2" />
                Winners Management
            </Title>

            <Card 
                title="Available Offers" 
                className="mb-6 shadow-sm"
                loading={loadingOffers}
            >
                <Table
                    columns={offerColumns}
                    dataSource={offers}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                />
            </Card>

            <Card 
                title="Winners History" 
                className="shadow-sm"
                loading={loadingWinners}
            >
                <Table
                    columns={winnersColumns}
                    dataSource={Array.isArray(winners) ? winners : []}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                />
            </Card>

            {/* Announcement Modal */}
            <Modal
                title={
                    <span>
                        <GiftOutlined className="mr-2" />
                        Announce Winners - {selectedOffer?.title}
                    </span>
                }
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSubmit}
                okText={loadingSubmit ? 'Announcing...' : 'Announce Winners'}
                confirmLoading={loadingSubmit}
                width={600}
                okButtonProps={{
                    disabled: winners.filter(w => w.offerId?._id === selectedOffer?._id).length >= 3
                }}
            >
                <div className="space-y-4">
                    {selectedOffer && (
                        <Alert
                            message={`This offer currently has ${winners.filter(w => w.offerId?._id === selectedOffer._id).length}/3 winners selected`}
                            type="info"
                            showIcon
                        />
                    )}

                    <div>
                        <label className="block mb-2 font-medium">Select Package</label>
                        <Select
                            style={{ width: '100%' }}
                            placeholder={loadingPackages ? "Loading packages..." : "Select package"}
                            onChange={(value) => setFormData({ ...formData, packageId: value })}
                            loading={loadingPackages}
                            value={formData.packageId || undefined}
                            optionFilterProp="children"
                            showSearch
                        >
                            {packages.map(pkg => (
                                <Select.Option key={pkg._id} value={pkg._id}>
                                    {pkg.name || pkg.title} (₹{pkg.discountedPrice || pkg.price})
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Number of Winners (max 3)</label>
                        <InputNumber
                            min={1}
                            max={3}
                            value={formData.numberOfWinners}
                            onChange={(value) => setFormData({ ...formData, numberOfWinners: value })}
                            style={{ width: '100%' }}
                            disabled={winners.filter(w => w.offerId?._id === selectedOffer?._id).length >= 3}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Select Winning Coupons (optional)</label>
                        <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="Select winning coupons"
                            onChange={(values) => setFormData({ ...formData, couponNumbers: values })}
                            value={formData.couponNumbers}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled={winners.filter(w => w.offerId?._id === selectedOffer?._id).length >= 3}
                        >
                            {coupons.map(coupon => (
                                <Select.Option key={coupon.couponNumber} value={coupon.couponNumber}>
                                    {coupon.couponNumber} (User: {coupon.userId?.email || coupon.userId})
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminSelectWinners;