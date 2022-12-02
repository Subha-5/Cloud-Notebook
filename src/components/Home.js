import Notes from './Notes';

export default function Home (props) {
  const {showAlert} = props
  return (
    <>
      <div className='container my-3'>
        <h1>This is iNotebook - your secured notebook in the cloud</h1>

        <Notes showAlert={showAlert}/>
        
      </div>

    </>
  )
}
