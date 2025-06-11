import styles from '@scss/play.module.scss';

function Play(props) {
  return (
    <>
      <section className={styles['piano-container']}>
        <div className={styles['piano']}>
          <div className={styles['piano-play-btn']}>
            <Lane key={props.key} id={props.id} />
          </div>
        </div>
      </section>
    </>
  );
}

export default Play;
