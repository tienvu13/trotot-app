export type RentalListing = {
  id: string;
  title: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  price: string;
  area: string;
  bedrooms: number;
  description: string;
  tags: string[];
  imageUrl: string;
  contact: string;
  latitude: number;
  longitude: number;
  ownerEmail: string;
  status: 'available' | 'rented';
};

export const provinces = ['Tất cả', 'TP.HCM', 'Hà Nội'];

export const rentalListings: RentalListing[] = [
  {
    id: 'room-1',
    title: 'Phòng trọ tiện nghi Quận 1',
    province: 'TP.HCM',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    address: 'Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
    price: '3.500.000 đ/tháng',
    area: '20m²',
    bedrooms: 1,
    description:
      'Phòng trọ mới, có máy lạnh, WC riêng, sân thượng chung. Nằm ngay trung tâm thành phố, gần chợ Bến Thành và các tuyến Metro.',
    tags: ['WC riêng', 'Gần Metro', 'Giờ giấc tự do'],
    imageUrl:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    contact: '0909 123 456',
    latitude: 10.7745,
    longitude: 106.7019,
    ownerEmail: '',
    status: 'available',
  },
  {
    id: 'room-2',
    title: 'Mini apartment Gò Vấp',
    province: 'TP.HCM',
    district: 'Gò Vấp',
    ward: 'Phường 5',
    address: 'Phường 5, Gò Vấp, TP.HCM',
    price: '5.200.000 đ/tháng',
    area: '25m²',
    bedrooms: 1,
    description:
      'Căn hộ nhỏ đẹp, đầy đủ nội thất, ban công thoáng mát. An ninh 24/7 và gần chợ, bưu điện.',
    tags: ['Ban công', 'Nội thất', 'An ninh 24/7'],
    imageUrl:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    contact: '0918 765 432',
    latitude: 10.8220,
    longitude: 106.6870,
    ownerEmail: '',
    status: 'available',
  },
  {
    id: 'room-3',
    title: 'Phòng trọ Quận 3 gần trường',
    province: 'TP.HCM',
    district: 'Quận 3',
    ward: 'Phường Võ Thị Sáu',
    address: 'Đường Nguyễn Đình Chiểu, Phường Võ Thị Sáu, Quận 3, TP.HCM',
    price: '6.000.000 đ/tháng',
    area: '28m²',
    bedrooms: 1,
    description:
      'Phòng sạch, đủ tiện nghi, yên tĩnh. Gần nhiều trường đại học và quán ăn, phù hợp sinh viên và người đi làm.',
    tags: ['Gần trường', 'Phòng sạch', 'Tự do giờ giấc'],
    imageUrl:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    contact: '0932 123 789',
    latitude: 10.7840,
    longitude: 106.6870,
    ownerEmail: '',
    status: 'available',
  },
  {
    id: 'room-4',
    title: 'Studio Thủ Đức full nội thất',
    province: 'TP.HCM',
    district: 'Thủ Đức',
    ward: 'Phường Linh Chiểu',
    address: 'Đường Võ Văn Ngân, Phường Linh Chiểu, Thủ Đức, TP.HCM',
    price: '7.200.000 đ/tháng',
    area: '32m²',
    bedrooms: 1,
    description:
      'Studio hiện đại, có bếp nhỏ và không gian làm việc. Gần trạm xe buýt, siêu thị và trung tâm thương mại.',
    tags: ['Full nội thất', 'Nấu ăn được', 'Gần siêu thị'],
    imageUrl:
      'https://images.unsplash.com/photo-1560185127-6d0f5f9c6f20?auto=format&fit=crop&w=900&q=80',
    contact: '0987 654 321',
    latitude: 10.8510,
    longitude: 106.7550,
    ownerEmail: '',
    status: 'available',
  },
  {
    id: 'room-5',
    title: 'Phòng trọ giá tốt gần đại học',
    province: 'TP.HCM',
    district: 'Quận 3',
    ward: 'Phường Võ Thị Sáu',
    address: 'Đường Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Quận 3, TP.HCM',
    price: '4.300.000 đ/tháng',
    area: '22m²',
    bedrooms: 1,
    description:
      'Phòng trọ cho sinh viên, nằm gần nhiều trường đại học, khu ăn uống và tiện ích công cộng.',
    tags: ['Giá tốt', 'Gần trường', 'Khu ăn uống'],
    imageUrl:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    contact: '0901 234 567',
    latitude: 10.7850,
    longitude: 106.6850,
    ownerEmail: '',
    status: 'available',
  },
  {
    id: 'room-6',
    title: 'Phòng trọ Ba Đình yên tĩnh',
    province: 'Hà Nội',
    district: 'Quận Ba Đình',
    ward: 'Phường Cống Vị',
    address: 'Đường Đội Cấn, Phường Cống Vị, Quận Ba Đình, Hà Nội',
    price: '4.200.000 đ/tháng',
    area: '18m²',
    bedrooms: 1,
    description:
      'Phòng trọ nhỏ gọn, có điều hòa và WC riêng. Gần công viên Thủ Lệ, an ninh tốt và tiện đi lại.',
    tags: ['WC riêng', 'Gần công viên', 'An ninh'],
    imageUrl:
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80',
    contact: '0904 555 123',
    latitude: 21.0415,
    longitude: 105.8142,
    ownerEmail: '',
    status: 'available',
  },
  {
    id: 'room-7',
    title: 'Mini studio Hồ Hoàn Kiếm',
    province: 'Hà Nội',
    district: 'Quận Hoàn Kiếm',
    ward: 'Phường Hàng Bài',
    address: 'Đường Hàng Bài, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội',
    price: '6.800.000 đ/tháng',
    area: '24m²',
    bedrooms: 1,
    description:
      'Căn hộ mini ngay trung tâm, thuận tiện cho công việc và đi lại. Gần Hồ Gươm, phố đi bộ và chợ Đồng Xuân.',
    tags: ['Trung tâm', 'Gần Hồ Gươm', 'Tiện nghi'],
    imageUrl:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    contact: '0912 777 888',
    latitude: 21.0278,
    longitude: 105.8530,
    ownerEmail: '',
    status: 'available',
  },
  {
    id: 'room-8',
    title: 'Phòng trọ Tây Hồ thoáng đãng',
    province: 'Hà Nội',
    district: 'Quận Tây Hồ',
    ward: 'Phường Xuân La',
    address: 'Đường Võ Chí Công, Phường Xuân La, Quận Tây Hồ, Hà Nội',
    price: '5.500.000 đ/tháng',
    area: '26m²',
    bedrooms: 1,
    description:
      'Phòng trọ view sông Hồng, rộng rãi và nhiều ánh sáng. Gần trường quốc tế, siêu thị và hồ Tây.',
    tags: ['View sông', 'Rộng rãi', 'Gần trường'],
    imageUrl:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
    contact: '0945 321 678',
    latitude: 21.0674,
    longitude: 105.8105,
    ownerEmail: '',
    status: 'available',
  },
  {
    id: 'room-9',
    title: 'Phòng trọ Cầu Giấy hiện đại',
    province: 'Hà Nội',
    district: 'Quận Cầu Giấy',
    ward: 'Phường Dịch Vọng',
    address: 'Đường Trương Công Giai, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội',
    price: '5.900.000 đ/tháng',
    area: '28m²',
    bedrooms: 1,
    description:
      'Phòng nằm gần khu công nghệ cao và nhiều tòa văn phòng. Nội thất hiện đại, gần Metro và siêu thị.',
    tags: ['Gần Metro', 'Nội thất', 'An ninh 24/7'],
    imageUrl:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    contact: '0977 123 456',
    latitude: 21.0282,
    longitude: 105.7868,
    ownerEmail: '',
    status: 'available',
  },
  {
    id: 'room-10',
    title: 'Phòng trọ Thanh Xuân tiện lợi',
    province: 'Hà Nội',
    district: 'Quận Thanh Xuân',
    ward: 'Phường Khương Trung',
    address: 'Đường Nguyễn Trãi, Phường Khương Trung, Quận Thanh Xuân, Hà Nội',
    price: '4.800.000 đ/tháng',
    area: '23m²',
    bedrooms: 1,
    description:
      'Phòng trọ gần trường đại học và nhiều cửa hàng tiện ích. Giao thông thuận tiện, phù hợp sinh viên và nhân viên văn phòng.',
    tags: ['Gần đại học', 'Tiện ích', 'Giá hợp lý'],
    imageUrl:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    contact: '0980 444 999',
    latitude: 20.9924,
    longitude: 105.8115,
    ownerEmail: '',
    status: 'available',
  },
];
