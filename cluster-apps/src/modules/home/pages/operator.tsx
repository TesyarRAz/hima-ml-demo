import useAuthStore from '../../auth/hooks/use-auth-store';
import { useShallow } from 'zustand/shallow';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth, firestoreDB } from '../../../lib/firebase';
import InterestForm from '../components/interest.form';
import { collection, deleteDoc, getDocs } from 'firebase/firestore';
import { GlobalAlert } from '../../../lib/alert';
import { useEffect } from 'react';
import { queryClient } from '../../../lib/queryclient';

const OperatorPage = () => {

  const [user] = useAuthState(firebaseAuth);

  const [
    isOperatorCheck
  ] = useAuthStore(useShallow((state) => [
    state.isOperator,
  ]))

  const { data: isOperator } = useQuery({
    queryKey: ['isOperator', user?.uid],
    queryFn: () => {
      if (user) {
        return isOperatorCheck(user);
      }
      return Promise.resolve(false);
    },
    enabled: !!user,
    initialData: false,
  })

  useEffect(() => {
    if (user) {
      queryClient.invalidateQueries({ queryKey: ['isOperator', user?.uid] });
    }
  }, [user])

  const clearInterests = useMutation({
    mutationKey: ['clearInterests'],
    mutationFn: async () => {
      const colRef = collection(firestoreDB, "userInterests");
      const snapshot = await getDocs(colRef);

      const batch = snapshot.docs.map(doc => deleteDoc(doc.ref));

      const interestsClustered = collection(firestoreDB, "userInterestsClustered");
      const snapshotInterests = await getDocs(interestsClustered);
      batch.push(...snapshotInterests.docs.map(doc => deleteDoc(doc.ref)));

      const interests = collection(firestoreDB, "interests");
      const snapshotAllInterests = await getDocs(interests);
      batch.push(...snapshotAllInterests.docs.map(doc => deleteDoc(doc.ref)));

      await Promise.all(batch);
    },
    onSuccess: () => {
      GlobalAlert.fire({
        icon: 'success',
        title: 'Interests cleared successfully',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    },
    onError: (error) => {
      GlobalAlert.fire({
        icon: 'error',
        title: 'Failed to clear interests',
        text: error.message,
      });
    }
  })

  return (
    <div className='flex flex-col h-full p-4 gap-4'>

      {isOperator && (
        <div className='w-80 border p-4 rounded shadow-lg'>
          <h2 className='text-2xl font-semibold mb-2'>Setup Interests</h2>
          <InterestForm />

          {/* clear interest */}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mt-4 cursor-pointer"
            onClick={() => {
              clearInterests.mutate();
            }}>
            Clear Interests
          </button>
        </div>
      )}
    </div>
  )
}

export default OperatorPage