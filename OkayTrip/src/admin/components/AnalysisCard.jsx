import PropTypes from 'prop-types';

export default function AnalysisCard({ cover, subtitle, title, style }) {
    return (
        <div
            className="flex flex-col items-center rounded-2xl py-10 "
            style={{
                ...style,
            }}
        >
            <img src={cover} alt="Icon"/>
            <span className="text-3xl font-bold">{title}</span>
            <span className="text-sm">{subtitle}</span>
        </div>
    );
}

AnalysisCard.propTypes = {
    cover: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    subtitle: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    style: PropTypes.object,
  };
